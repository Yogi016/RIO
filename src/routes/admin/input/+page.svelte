<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { authSession } from '$lib/stores/auth.js';
  import { kecamatanList } from '$lib/stores/kecamatan.js';
  import { saveKecamatan, deleteKecamatan } from '$lib/data/kecamatanService.js';
  import { 
    Plus, 
    Trash2, 
    Save, 
    Database, 
    ChevronRight, 
    Building2, 
    Users, 
    Wheat, 
    Trees, 
    Bird, 
    MapPin,
    AlertCircle
  } from '@lucide/svelte';
  import { 
    indonesiaProvinces, 
    indonesiaRegencies, 
    indonesiaDistricts 
  } from '$lib/data/indonesiaAreas.js';

  // --- Route Guard ---
  $effect(() => {
    if (!browser) return;
    if (!$authSession) {
      goto('/login');
    } else if ($authSession.role !== 'admin' && $authSession.role !== 'super_admin') {
      goto('/');
    }
  });

  // --- State ---
  let selectedMode = $state('new'); // 'new' atau 'edit'
  let editTargetId = $state(''); // ID kecamatan yang diedit
  let activeTab = $state('identitas'); // identitas, penduduk, pertanian, perkebunan, peternakan
  let saveStatus = $state(''); // 'success', 'error', 'saving', atau ''
  let errorMessage = $state('');

  // --- BPS Cascaded Selection ---
  let selectedProvinceCode = $state('');
  let selectedRegencyCode = $state('');
  let selectedDistrictCode = $state('');

  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const provincesList = $derived(
    [...indonesiaProvinces].sort((a, b) => a.name.localeCompare(b.name))
  );

  const regenciesList = $derived(
    selectedProvinceCode
      ? [...indonesiaRegencies]
          .filter((r) => r.province_code === selectedProvinceCode)
          .sort((a, b) => a.name.localeCompare(b.name))
      : []
  );

  const districtsList = $derived(
    selectedRegencyCode
      ? [...indonesiaDistricts]
          .filter((d) => d.regency_code === selectedRegencyCode)
          .sort((a, b) => a.name.localeCompare(b.name))
      : []
  );

  // Auto-populate when district is selected
  $effect(() => {
    if (selectedDistrictCode) {
      const dist = indonesiaDistricts.find((d) => d.code === selectedDistrictCode);
      const reg = indonesiaRegencies.find((r) => r.code === selectedRegencyCode);
      const prov = indonesiaProvinces.find((p) => p.code === selectedProvinceCode);

      if (dist && reg && prov) {
        formState.nama = toTitleCase(dist.name);
        formState.kabupaten = toTitleCase(reg.name);
        formState.provinsi = toTitleCase(prov.name);
      }
    }
  });

  // Check URL query parameters for edit target
  $effect(() => {
    if (browser && $kecamatanList.length > 0) {
      const editSlug = page.url.searchParams.get('edit');
      if (editSlug) {
        const kec = $kecamatanList.find((k) => k.id === editSlug);
        if (kec) {
          selectedMode = 'edit';
          editTargetId = editSlug;
          formState = JSON.parse(JSON.stringify(kec));
        }
      }
    }
  });

  // Default values
  const defaultPertanian = [
    { komoditas: 'Padi', luasTanam: 0, luasPanen: 0, produksi: 0, produktivitas: 0 },
    { komoditas: 'Jagung', luasTanam: 0, luasPanen: 0, produksi: 0, produktivitas: 0 },
    { komoditas: 'Ubi Kayu', luasTanam: 0, luasPanen: 0, produksi: 0, produktivitas: 0 }
  ];

  const defaultPerkebunan = [
    { komoditas: 'Kelapa Sawit', luasAreal: 0, produksi: 0, jumlahPetani: 0 },
    { komoditas: 'Karet', luasAreal: 0, produksi: 0, jumlahPetani: 0 },
    { komoditas: 'Kelapa', luasAreal: 0, produksi: 0, jumlahPetani: 0 }
  ];

  const defaultPeternakan = [
    { jenis: 'Sapi', populasi: 0, produksiDaging: 0, produksiTelur: 0 },
    { jenis: 'Kambing', populasi: 0, produksiDaging: 0, produksiTelur: 0 },
    { jenis: 'Ayam Buras', populasi: 0, produksiDaging: 0, produksiTelur: 0 }
  ];

  // Form Model
  let formState = $state({
    nama: '',
    id: '', // slug
    kabupaten: '',
    provinsi: '',
    negaraTetangga: '',
    plbn: '',
    administrasi: {
      luasWilayah: 0,
      jumlahDesa: 0,
      jumlahDusun: 0,
      jumlahRT: 0,
      jumlahRW: 0,
      camat: ''
    },
    penduduk: {
      jumlahTotal: 0,
      lakilaki: 0,
      perempuan: 0,
      kepadatan: 0,
      jumlahKK: 0,
      pertumbuhanPersen: 0
    },
    pertanian: JSON.parse(JSON.stringify(defaultPertanian)),
    perkebunan: JSON.parse(JSON.stringify(defaultPerkebunan)),
    peternakan: JSON.parse(JSON.stringify(defaultPeternakan))
  });

  // Auto-generate slug from name
  $effect(() => {
    if (selectedMode === 'new' && formState.nama) {
      formState.id = formState.nama
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  });

  // Auto-calculate population density (kepadatan)
  $effect(() => {
    const total = Number(formState.penduduk.jumlahTotal) || 0;
    const luas = Number(formState.administrasi.luasWilayah) || 0;
    if (luas > 0) {
      formState.penduduk.kepadatan = Number((total / luas).toFixed(2));
    } else {
      formState.penduduk.kepadatan = 0;
    }
  });

  // Auto-calculate total population from males + females
  $effect(() => {
    const l = Number(formState.penduduk.lakilaki) || 0;
    const p = Number(formState.penduduk.perempuan) || 0;
    if (l > 0 || p > 0) {
      formState.penduduk.jumlahTotal = l + p;
    }
  });

  // Auto-calculate agricultural productivity
  function handlePertanianCalc(index) {
    const panen = Number(formState.pertanian[index].luasPanen) || 0;
    const prod = Number(formState.pertanian[index].produksi) || 0;
    if (panen > 0) {
      formState.pertanian[index].produktivitas = Number((prod / panen).toFixed(2));
    } else {
      formState.pertanian[index].produktivitas = 0;
    }
  }

  // --- Handlers ---
  function handleModeChange() {
    saveStatus = '';
    errorMessage = '';
    
    if (selectedMode === 'new') {
      editTargetId = '';
      formState = {
        nama: '',
        id: '',
        kabupaten: '',
        provinsi: '',
        negaraTetangga: '',
        plbn: '',
        administrasi: {
          luasWilayah: 0,
          jumlahDesa: 0,
          jumlahDusun: 0,
          jumlahRT: 0,
          jumlahRW: 0,
          camat: ''
        },
        penduduk: {
          jumlahTotal: 0,
          lakilaki: 0,
          perempuan: 0,
          kepadatan: 0,
          jumlahKK: 0,
          pertumbuhanPersen: 0
        },
        pertanian: JSON.parse(JSON.stringify(defaultPertanian)),
        perkebunan: JSON.parse(JSON.stringify(defaultPerkebunan)),
        peternakan: JSON.parse(JSON.stringify(defaultPeternakan))
      };
    } else if (editTargetId) {
      const kec = $kecamatanList.find((k) => k.id === editTargetId);
      if (kec) {
        // Deep copy
        formState = JSON.parse(JSON.stringify(kec));
      }
    }
  }

  function handleEditTargetChange(e) {
    editTargetId = e.target.value;
    if (editTargetId) {
      selectedMode = 'edit';
      handleModeChange();
    } else {
      selectedMode = 'new';
      handleModeChange();
    }
  }

  // Row Manipulation
  function addRow(section) {
    if (section === 'pertanian') {
      formState.pertanian = [...formState.pertanian, { komoditas: '', luasTanam: 0, luasPanen: 0, produksi: 0, produktivitas: 0 }];
    } else if (section === 'perkebunan') {
      formState.perkebunan = [...formState.perkebunan, { komoditas: '', luasAreal: 0, produksi: 0, jumlahPetani: 0 }];
    } else if (section === 'peternakan') {
      formState.peternakan = [...formState.peternakan, { jenis: '', populasi: 0, produksiDaging: 0, produksiTelur: 0 }];
    }
  }

  function removeRow(section, index) {
    if (section === 'pertanian') {
      formState.pertanian = formState.pertanian.filter((_, i) => i !== index);
    } else if (section === 'perkebunan') {
      formState.perkebunan = formState.perkebunan.filter((_, i) => i !== index);
    } else if (section === 'peternakan') {
      formState.peternakan = formState.peternakan.filter((_, i) => i !== index);
    }
  }

  // --- Save & Delete ---
  async function handleSubmit(event) {
    event.preventDefault();
    
    // Validasi dasar
    if (!formState.nama || !formState.id || !formState.kabupaten || !formState.provinsi) {
      errorMessage = 'Mohon lengkapi Nama Kecamatan, Slug, Kabupaten, dan Provinsi.';
      saveStatus = 'error';
      return;
    }

    saveStatus = 'saving';
    errorMessage = '';

    try {
      // 1. Simpan via Service (Supabase jika terhubung)
      const res = await saveKecamatan(formState);

      // 2. Simpan secara Lokal (Fallback ke LocalStorage & update store)
      let newList = [...$kecamatanList];
      const index = newList.findIndex((k) => k.id === formState.id);
      
      if (index !== -1) {
        newList[index] = JSON.parse(JSON.stringify(formState));
      } else {
        newList.push(JSON.parse(JSON.stringify(formState)));
      }
      
      // Update Store
      kecamatanList.set(newList);

      // Sync LocalStorage
      localStorage.setItem('rio_custom_kecamatan', JSON.stringify(newList));

      saveStatus = 'success';
      
      setTimeout(() => {
        goto(`/kecamatan/${formState.id}`);
      }, 1200);

    } catch (err) {
      console.error(err);
      errorMessage = err.message || 'Gagal menyimpan data wilayah.';
      saveStatus = 'error';
    }
  }

  async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh data Kecamatan ${formState.nama}?`)) {
      return;
    }

    saveStatus = 'saving';
    try {
      // 1. Hapus via Service (Supabase jika terhubung)
      await deleteKecamatan(formState.id);

      // 2. Hapus secara Lokal
      let newList = $kecamatanList.filter((k) => k.id !== formState.id);
      
      // Update Store & LocalStorage
      kecamatanList.set(newList);
      localStorage.setItem('rio_custom_kecamatan', JSON.stringify(newList));

      saveStatus = 'success';
      selectedMode = 'new';
      handleModeChange();
      
      alert('Data kecamatan berhasil dihapus.');
      goto('/');
    } catch (err) {
      console.error(err);
      errorMessage = err.message || 'Gagal menghapus data wilayah.';
      saveStatus = 'error';
    }
  }
</script>

<svelte:head>
  <title>Kelola Data Potensi — RIO Kemendagri</title>
</svelte:head>

<div class="input-page">
  <!-- Header -->
  <header class="input-page__header">
    <div class="input-page__header-text">
      <h2>Pengelolaan Data Potensi Wilayah</h2>
      <p>Tambahkan kecamatan baru atau edit data potensi yang sudah terdaftar di sistem.</p>
    </div>
    
    <!-- Selector Mode -->
    <div class="input-page__selector">
      <label for="editSelect">Pilih Wilayah Kerja:</label>
      <select id="editSelect" bind:value={editTargetId} onchange={handleEditTargetChange}>
        <option value="">-- Tambah Kecamatan Baru --</option>
        {#each $kecamatanList as kec}
          <option value={kec.id}>Edit {kec.nama} ({kec.kabupaten})</option>
        {/each}
      </select>
    </div>
  </header>

  <!-- Status Alert -->
  {#if saveStatus === 'success'}
    <div class="alert alert--success animate-fade-in">
      <Save size={18} />
      <span>Data berhasil disimpan! Mengalihkan ke halaman detail...</span>
    </div>
  {:else}
    {#if saveStatus === 'saving'}
      <div class="alert alert--info animate-fade-in">
        <div class="spinner"></div>
        <span>Sedang menyimpan data ke sistem...</span>
      </div>
    {/if}
    {#if saveStatus === 'error'}
      <div class="alert alert--error animate-fade-in">
        <AlertCircle size={18} />
        <span><strong>Gagal menyimpan:</strong> {errorMessage}</span>
      </div>
    {/if}
  {/if}

  <!-- Form Container -->
  <form onsubmit={handleSubmit} class="form-container glass-card">
    <!-- Tabs Navigation -->
    <nav class="form-tabs" aria-label="Navigasi form data">
      <button 
        type="button" 
        class="form-tab" 
        class:active={activeTab === 'identitas'} 
        onclick={() => activeTab = 'identitas'}
      >
        <MapPin size={16} />
        <span>Identitas & Admin</span>
      </button>
      <button 
        type="button" 
        class="form-tab" 
        class:active={activeTab === 'penduduk'} 
        onclick={() => activeTab = 'penduduk'}
      >
        <Users size={16} />
        <span>Kependudukan</span>
      </button>
      <button 
        type="button" 
        class="form-tab" 
        class:active={activeTab === 'pertanian'} 
        onclick={() => activeTab = 'pertanian'}
      >
        <Wheat size={16} />
        <span>Pertanian</span>
      </button>
      <button 
        type="button" 
        class="form-tab" 
        class:active={activeTab === 'perkebunan'} 
        onclick={() => activeTab = 'perkebunan'}
      >
        <Trees size={16} />
        <span>Perkebunan</span>
      </button>
      <button 
        type="button" 
        class="form-tab" 
        class:active={activeTab === 'peternakan'} 
        onclick={() => activeTab = 'peternakan'}
      >
        <Bird size={16} />
        <span>Peternakan</span>
      </button>
    </nav>

    <!-- Tab Contents -->
    <div class="form-content">
      
      <!-- 1. Identitas & Administrasi -->
      {#if activeTab === 'identitas'}
        <div class="tab-pane animate-fade-in">
          <h3 class="tab-pane__title">Identitas Wilayah & Administrasi</h3>
          
          {#if selectedMode === 'new'}
            <div class="bps-helper glass-card">
              <h4 class="bps-helper__title">
                <Database size={16} />
                <span>Pilih dari Wilayah Resmi Indonesia (BPS)</span>
              </h4>
              <p class="bps-helper__desc">Pilih provinsi, kabupaten, dan kecamatan untuk mengisi otomatis kolom identitas wilayah.</p>
              <div class="bps-helper__grid">
                <label>
                  <span>Provinsi</span>
                  <select bind:value={selectedProvinceCode} onchange={() => { selectedRegencyCode = ''; selectedDistrictCode = ''; }}>
                    <option value="">-- Pilih Provinsi --</option>
                    {#each provincesList as prov}
                      <option value={prov.code}>{toTitleCase(prov.name)}</option>
                    {/each}
                  </select>
                </label>

                <label>
                  <span>Kabupaten / Kota</span>
                  <select bind:value={selectedRegencyCode} onchange={() => selectedDistrictCode = ''} disabled={!selectedProvinceCode}>
                    <option value="">-- Pilih Kabupaten/Kota --</option>
                    {#each regenciesList as reg}
                      <option value={reg.code}>{toTitleCase(reg.name)}</option>
                    {/each}
                  </select>
                </label>

                <label>
                  <span>Kecamatan</span>
                  <select bind:value={selectedDistrictCode} disabled={!selectedRegencyCode}>
                    <option value="">-- Pilih Kecamatan --</option>
                    {#each districtsList as dist}
                      <option value={dist.code}>{toTitleCase(dist.name)}</option>
                    {/each}
                  </select>
                </label>
              </div>
            </div>
          {/if}
          
          <div class="form-grid">
            <label>
              <span>Nama Kecamatan *</span>
              <input type="text" bind:value={formState.nama} placeholder="Contoh: Entikong" required />
            </label>
            
            <label>
              <span>Kode Slug (ID) *</span>
              <input type="text" bind:value={formState.id} placeholder="entikong" readonly={selectedMode === 'edit'} required />
              <small>Dibuat otomatis dari nama kecamatan untuk rute URL.</small>
            </label>
            
            <label>
              <span>Kabupaten *</span>
              <input type="text" bind:value={formState.kabupaten} placeholder="Sanggau" required />
            </label>
            
            <label>
              <span>Provinsi *</span>
              <input type="text" bind:value={formState.provinsi} placeholder="Kalimantan Barat" required />
            </label>
            
            <label>
              <span>Negara Perbatasan</span>
              <input type="text" bind:value={formState.negaraTetangga} placeholder="Malaysia (Sarawak)" />
            </label>
            
            <label>
              <span>Nama PLBN</span>
              <input type="text" bind:value={formState.plbn} placeholder="PLBN Entikong" />
            </label>

            <label>
              <span>Nama Camat</span>
              <input type="text" bind:value={formState.administrasi.camat} placeholder="Nama Camat" />
            </label>
            
            <label>
              <span>Luas Wilayah (km²)</span>
              <input type="number" step="0.01" bind:value={formState.administrasi.luasWilayah} min="0" />
            </label>

            <label>
              <span>Jumlah Desa / Kelurahan</span>
              <input type="number" bind:value={formState.administrasi.jumlahDesa} min="0" />
            </label>
            
            <label>
              <span>Jumlah Dusun</span>
              <input type="number" bind:value={formState.administrasi.jumlahDusun} min="0" />
            </label>

            <label>
              <span>Jumlah RT</span>
              <input type="number" bind:value={formState.administrasi.jumlahRT} min="0" />
            </label>

            <label>
              <span>Jumlah RW</span>
              <input type="number" bind:value={formState.administrasi.jumlahRW} min="0" />
            </label>
          </div>
        </div>
      {/if}

      <!-- 2. Kependudukan -->
      {#if activeTab === 'penduduk'}
        <div class="tab-pane animate-fade-in">
          <h3 class="tab-pane__title">Data Demografi & Kependudukan</h3>
          
          <div class="form-grid">
            <label>
              <span>Jumlah Laki-Laki (jiwa)</span>
              <input type="number" bind:value={formState.penduduk.lakilaki} min="0" />
            </label>
            
            <label>
              <span>Jumlah Perempuan (jiwa)</span>
              <input type="number" bind:value={formState.penduduk.perempuan} min="0" />
            </label>

            <label>
              <span>Total Penduduk (jiwa)</span>
              <input type="number" bind:value={formState.penduduk.jumlahTotal} min="0" readonly />
              <small>Dihitung otomatis: Laki-laki + Perempuan.</small>
            </label>
            
            <label>
              <span>Jumlah KK</span>
              <input type="number" bind:value={formState.penduduk.jumlahKK} min="0" />
            </label>

            <label>
              <span>Kepadatan Penduduk (jiwa/km²)</span>
              <input type="number" step="0.01" bind:value={formState.penduduk.kepadatan} readonly />
              <small>Dihitung otomatis: Penduduk / Luas Wilayah.</small>
            </label>

            <label>
              <span>Laju Pertumbuhan (%)</span>
              <input type="number" step="0.01" bind:value={formState.penduduk.pertumbuhanPersen} />
            </label>
          </div>
        </div>
      {/if}

      <!-- 3. Pertanian -->
      {#if activeTab === 'pertanian'}
        <div class="tab-pane animate-fade-in">
          <div class="tab-pane__header">
            <h3 class="tab-pane__title">Komoditas Tanaman Pangan (Pertanian)</h3>
            <button type="button" class="btn btn--secondary btn--sm" onclick={() => addRow('pertanian')}>
              <Plus size={14} />
              <span>Tambah Komoditas</span>
            </button>
          </div>

          <div class="table-responsive">
            <table class="form-table">
              <thead>
                <tr>
                  <th>Nama Komoditas</th>
                  <th>Luas Tanam (ha)</th>
                  <th>Luas Panen (ha)</th>
                  <th>Produksi (ton)</th>
                  <th>Produktivitas (ton/ha)</th>
                  <th style="width: 50px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each formState.pertanian as row, i}
                  <tr>
                    <td>
                      <input type="text" bind:value={row.komoditas} placeholder="Padi / Jagung / dll" required />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.luasTanam} min="0" />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.luasPanen} min="0" oninput={() => handlePertanianCalc(i)} />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.produksi} min="0" oninput={() => handlePertanianCalc(i)} />
                    </td>
                    <td>
                      <input type="number" step="0.01" bind:value={row.produktivitas} readonly />
                    </td>
                    <td>
                      <button type="button" class="btn-delete" onclick={() => removeRow('pertanian', i)} aria-label="Hapus baris">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                {/each}
                {#if formState.pertanian.length === 0}
                  <tr>
                    <td colspan="6" class="text-muted text-center" style="padding: var(--space-lg);">
                      Belum ada data komoditas pertanian. Klik tombol "Tambah Komoditas" untuk menambahkan.
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      <!-- 4. Perkebunan -->
      {#if activeTab === 'perkebunan'}
        <div class="tab-pane animate-fade-in">
          <div class="tab-pane__header">
            <h3 class="tab-pane__title">Komoditas Perkebunan</h3>
            <button type="button" class="btn btn--secondary btn--sm" onclick={() => addRow('perkebunan')}>
              <Plus size={14} />
              <span>Tambah Komoditas</span>
            </button>
          </div>

          <div class="table-responsive">
            <table class="form-table">
              <thead>
                <tr>
                  <th>Nama Komoditas</th>
                  <th>Luas Areal (ha)</th>
                  <th>Produksi (ton)</th>
                  <th>Jumlah Petani (kk)</th>
                  <th style="width: 50px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each formState.perkebunan as row, i}
                  <tr>
                    <td>
                      <input type="text" bind:value={row.komoditas} placeholder="Kelapa Sawit / Karet" required />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.luasAreal} min="0" />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.produksi} min="0" />
                    </td>
                    <td>
                      <input type="number" bind:value={row.jumlahPetani} min="0" />
                    </td>
                    <td>
                      <button type="button" class="btn-delete" onclick={() => removeRow('perkebunan', i)} aria-label="Hapus baris">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                {/each}
                {#if formState.perkebunan.length === 0}
                  <tr>
                    <td colspan="5" class="text-muted text-center" style="padding: var(--space-lg);">
                      Belum ada data komoditas perkebunan. Klik tombol "Tambah Komoditas" untuk menambahkan.
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      <!-- 5. Peternakan -->
      {#if activeTab === 'peternakan'}
        <div class="tab-pane animate-fade-in">
          <div class="tab-pane__header">
            <h3 class="tab-pane__title">Data Populasi & Produksi Ternak</h3>
            <button type="button" class="btn btn--secondary btn--sm" onclick={() => addRow('peternakan')}>
              <Plus size={14} />
              <span>Tambah Ternak</span>
            </button>
          </div>

          <div class="table-responsive">
            <table class="form-table">
              <thead>
                <tr>
                  <th>Jenis Hewan Ternak</th>
                  <th>Populasi (ekor)</th>
                  <th>Produksi Daging (ton)</th>
                  <th>Produksi Telur (butir)</th>
                  <th style="width: 50px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each formState.peternakan as row, i}
                  <tr>
                    <td>
                      <input type="text" bind:value={row.jenis} placeholder="Sapi / Kambing / Ayam" required />
                    </td>
                    <td>
                      <input type="number" bind:value={row.populasi} min="0" />
                    </td>
                    <td>
                      <input type="number" step="0.1" bind:value={row.produksiDaging} min="0" />
                    </td>
                    <td>
                      <input type="number" bind:value={row.produksiTelur} min="0" />
                    </td>
                    <td>
                      <button type="button" class="btn-delete" onclick={() => removeRow('peternakan', i)} aria-label="Hapus baris">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                {/each}
                {#if formState.peternakan.length === 0}
                  <tr>
                    <td colspan="5" class="text-muted text-center" style="padding: var(--space-lg);">
                      Belum ada data peternakan. Klik tombol "Tambah Ternak" untuk menambahkan.
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      {#if selectedMode === 'edit'}
        <button 
          type="button" 
          class="btn btn--danger btn--outline" 
          onclick={handleDelete}
          disabled={saveStatus === 'saving'}
        >
          <Trash2 size={16} />
          <span>Hapus Kecamatan</span>
        </button>
      {/if}
      
      <div style="margin-left: auto; display: flex; gap: var(--space-sm);">
        <a href="/" class="btn btn--outline" style="color: var(--text-primary);">Batal</a>
        <button 
          type="submit" 
          class="btn btn--primary" 
          disabled={saveStatus === 'saving'}
        >
          <Save size={16} />
          <span>Simpan Wilayah</span>
        </button>
      </div>
    </div>

  </form>
</div>

<style>
  .bps-helper {
    background: hsl(210, 40%, 99%);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    padding: var(--space-md) var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-bottom: var(--space-sm);
  }

  .bps-helper__title {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--accent-navy);
    font-size: 0.95rem;
    font-weight: 800;
    margin: 0;
  }

  .bps-helper__desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .bps-helper__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
    margin-top: var(--space-xs);
  }

  .bps-helper__grid label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .bps-helper__grid span {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .bps-helper__grid select {
    height: 42px;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
    padding: 0 0.8rem;
    font: inherit;
    font-size: 0.88rem;
    background: white;
    outline: none;
    transition: border var(--transition-fast), box-shadow var(--transition-fast);
  }

  .bps-helper__grid select:focus {
    border-color: var(--accent-green);
    box-shadow: 0 0 0 3px var(--accent-green-soft);
  }

  .bps-helper__grid select:disabled {
    background: hsl(210, 20%, 94%);
    color: var(--text-secondary);
    cursor: not-allowed;
  }

  .input-page {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .input-page__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .input-page__header-text h2 {
    color: var(--accent-navy);
    font-size: 1.6rem;
    font-weight: 800;
  }

  .input-page__header-text p {
    color: var(--text-secondary);
    font-size: 0.88rem;
    margin-top: 4px;
  }

  .input-page__selector {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: white;
    padding: 0.5rem 0.9rem;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .input-page__selector label {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .input-page__selector select {
    border: 1px solid var(--border-glass);
    padding: 0.35rem 0.6rem;
    border-radius: var(--radius-sm);
    font: inherit;
    font-size: 0.85rem;
    outline: none;
    background: hsl(210, 40%, 99%);
    color: var(--text-primary);
  }

  /* Alerts */
  .alert {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-lg);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .alert--success {
    background: var(--accent-green-soft);
    border: 1px solid hsla(152, 72%, 27%, 0.2);
    color: hsl(152, 72%, 24%);
  }

  .alert--info {
    background: var(--accent-blue-soft);
    border: 1px solid hsla(214, 60%, 25%, 0.16);
    color: hsl(214, 60%, 22%);
  }

  .alert--error {
    background: hsla(351, 80%, 94%, 0.8);
    border: 1px solid hsla(351, 65%, 45%, 0.18);
    color: hsl(351, 65%, 38%);
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Form Container */
  .form-container {
    background: white;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .form-tabs {
    display: flex;
    background: hsl(210, 24%, 97%);
    border-bottom: 1px solid var(--border-glass);
    overflow-x: auto;
  }

  .form-tab {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--text-secondary);
    border-right: 1px solid var(--border-glass);
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .form-tab:hover {
    background: hsla(210, 24%, 92%, 0.6);
    color: var(--accent-navy);
  }

  .form-tab.active {
    background: white;
    color: var(--accent-navy);
    border-bottom: 2px solid var(--accent-green);
    margin-bottom: -1px;
    height: calc(100% + 1px);
  }

  .form-content {
    padding: var(--space-xl);
    min-height: 400px;
  }

  .tab-pane {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .tab-pane__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
  }

  .tab-pane__title {
    color: var(--accent-navy);
    font-size: 1.15rem;
    font-weight: 800;
  }

  /* Form Grids */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg) var(--space-md);
  }

  .form-grid label,
  .form-table label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .form-grid span,
  .form-table span {
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .form-grid input,
  .form-table input {
    height: 42px;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
    padding: 0 0.8rem;
    font: inherit;
    font-size: 0.88rem;
    color: var(--text-primary);
    background: hsl(210, 40%, 99%);
    outline: none;
    transition: border var(--transition-fast), box-shadow var(--transition-fast);
  }

  .form-grid input:focus,
  .form-table input:focus {
    border-color: var(--accent-green);
    box-shadow: 0 0 0 3px var(--accent-green-soft);
    background: white;
  }

  .form-grid input[readonly] {
    background: hsl(210, 20%, 94%);
    color: var(--text-secondary);
    cursor: not-allowed;
  }

  .form-grid small {
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  /* Table styling inside form */
  .table-responsive {
    overflow-x: auto;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
  }

  .form-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    text-align: left;
  }

  .form-table th {
    background: hsl(210, 24%, 97%);
    padding: 0.8rem 1rem;
    font-weight: 800;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-glass);
  }

  .form-table td {
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid hsl(210, 24%, 93%);
    vertical-align: middle;
  }

  .form-table input {
    width: 100%;
    height: 36px;
  }

  .form-table input[readonly] {
    background: hsl(210, 20%, 95%);
    border-color: transparent;
    color: var(--text-secondary);
  }

  .btn-delete {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-md);
    border: 1px solid hsla(351, 65%, 45%, 0.16);
    background: hsla(351, 65%, 45%, 0.06);
    color: var(--accent-rose);
    transition: all var(--transition-fast);
  }

  .btn-delete:hover {
    background: var(--accent-rose);
    color: white;
  }

  /* Form Actions */
  .form-actions {
    background: hsl(210, 24%, 97%);
    padding: var(--space-md) var(--space-xl);
    border-top: 1px solid var(--border-glass);
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  /* General buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    min-height: 40px;
    padding: 0 1.2rem;
    border-radius: var(--radius-md);
    font-size: 0.82rem;
    font-weight: 800;
    transition: all var(--transition-fast);
  }

  .btn--primary {
    background: var(--accent-green);
    color: white;
  }

  .btn--primary:hover {
    background: hsl(152, 72%, 23%);
    box-shadow: 0 6px 16px hsla(152, 72%, 27%, 0.18);
  }

  .btn--secondary {
    background: var(--accent-navy-soft);
    color: var(--accent-navy);
    border: 1px solid hsla(214, 60%, 25%, 0.1);
  }

  .btn--secondary:hover {
    background: hsla(214, 60%, 25%, 0.15);
  }

  .btn--outline {
    border: 1px solid var(--border-glass);
    background: white;
  }

  .btn--outline:hover {
    background: hsl(210, 24%, 95%);
  }

  .btn--danger {
    background: var(--accent-rose);
    color: white;
  }

  .btn--danger--outline {
    border: 1px solid var(--accent-rose);
    background: transparent;
    color: var(--accent-rose);
  }

  .btn--danger:hover {
    background: hsl(351, 65%, 38%);
  }

  .btn--sm {
    min-height: 32px;
    padding: 0 0.8rem;
    font-size: 0.78rem;
  }

  /* Utility classes */
  .text-muted { color: var(--text-muted); }
  .text-center { text-align: center; }

  @media (max-width: 768px) {
    .input-page__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .input-page__selector {
      width: 100%;
      justify-content: space-between;
    }

    .form-actions {
      flex-direction: column;
      align-items: stretch;
      padding: var(--space-md) var(--space-lg);
    }

    .form-actions div {
      margin-left: 0 !important;
      flex-direction: column;
      align-items: stretch;
    }

    .form-content {
      padding: var(--space-lg);
    }
  }
</style>
