<script>
  import { page } from '$app/state';
  import { kecamatanList } from '$lib/stores/kecamatan.js';
  import { calculateTotal, formatNumber, formatHa, formatTon } from '$lib/utils/formatters.js';
  import StatCard from '$lib/components/StatCard.svelte';
  import CommodityTable from '$lib/components/CommodityTable.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import DoughnutChart from '$lib/components/DoughnutChart.svelte';
  import PopulationInfo from '$lib/components/PopulationInfo.svelte';
  import AdminInfo from '$lib/components/AdminInfo.svelte';
  import { Wheat, TreePine, Beef, Users, MapPin, ArrowLeft, Sprout, MilkOff } from '@lucide/svelte';

  const kecId = $derived(page.params.id);
  const kec = $derived($kecamatanList.find((k) => k.id === kecId));

  let activeTab = $state('pertanian');

  const tabs = [
    { id: 'pertanian', label: 'Pertanian', icon: Wheat, color: 'var(--accent-green)' },
    { id: 'perkebunan', label: 'Perkebunan', icon: TreePine, color: 'var(--accent-orange)' },
    { id: 'peternakan', label: 'Peternakan', icon: Beef, color: 'var(--accent-purple)' },
    { id: 'kependudukan', label: 'Kependudukan', icon: Users, color: 'var(--accent-blue)' },
  ];

  // Pertanian columns
  const pertanianCols = [
    { key: 'komoditas', label: 'Komoditas', align: 'left' },
    { key: 'luasTanam', label: 'Luas Tanam', unit: 'ha' },
    { key: 'luasPanen', label: 'Luas Panen', unit: 'ha' },
    { key: 'produksi', label: 'Produksi', unit: 'ton' },
    { key: 'produktivitas', label: 'Produktivitas', unit: 'ton/ha' },
  ];

  // Perkebunan columns
  const perkebunanCols = [
    { key: 'komoditas', label: 'Komoditas', align: 'left' },
    { key: 'luasAreal', label: 'Luas Areal', unit: 'ha' },
    { key: 'produksi', label: 'Produksi', unit: 'ton' },
    { key: 'jumlahPetani', label: 'Jumlah Petani', unit: 'KK' },
  ];

  // Peternakan columns
  const peternakanCols = [
    { key: 'jenis', label: 'Jenis Ternak', align: 'left' },
    { key: 'populasi', label: 'Populasi', unit: 'ekor' },
    { key: 'produksiDaging', label: 'Produksi Daging', unit: 'ton' },
    { key: 'produksiTelur', label: 'Produksi Telur', unit: 'butir' },
  ];

  // Chart data derivations
  const pertanianChart = $derived(
    kec
      ? {
          labels: kec.pertanian.map((p) => p.komoditas),
          datasets: [{ label: 'Produksi (ton)', data: kec.pertanian.map((p) => p.produksi) }],
        }
      : { labels: [], datasets: [] }
  );

  const perkebunanDonut = $derived(
    kec
      ? {
          labels: kec.perkebunan.map((p) => p.komoditas),
          values: kec.perkebunan.map((p) => p.luasAreal),
        }
      : { labels: [], values: [] }
  );

  const perkebunanPetaniChart = $derived(
    kec
      ? {
          labels: kec.perkebunan.map((p) => p.komoditas),
          datasets: [{ label: 'Jumlah Petani (KK)', data: kec.perkebunan.map((p) => p.jumlahPetani) }],
        }
      : { labels: [], datasets: [] }
  );

  const peternakanChart = $derived(
    kec
      ? {
          labels: kec.peternakan.map((p) => p.jenis),
          datasets: [{ label: 'Populasi (ekor)', data: kec.peternakan.map((p) => p.populasi) }],
        }
      : { labels: [], datasets: [] }
  );

  const peternakanDonut = $derived(
    kec
      ? {
          labels: kec.peternakan.filter(p => p.produksiDaging > 0).map((p) => p.jenis),
          values: kec.peternakan.filter(p => p.produksiDaging > 0).map((p) => p.produksiDaging),
        }
      : { labels: [], values: [] }
  );

  const pendudukDonut = $derived(
    kec
      ? {
          labels: ['Laki-laki', 'Perempuan'],
          values: [kec.penduduk.lakilaki, kec.penduduk.perempuan],
        }
      : { labels: [], values: [] }
  );
</script>

<svelte:head>
  <title>{kec ? `${kec.nama} — RIO Potensi Perbatasan` : 'Kecamatan — RIO'}</title>
</svelte:head>

{#if kec}
  <div class="detail">
    <!-- Back Button + Hero -->
    <header class="detail__header animate-fade-in-up">
      <a href="/" class="detail__back">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </a>

      <div class="detail__hero">
        <div class="detail__hero-info">
          <h1 class="detail__name">{kec.nama}</h1>
          <p class="detail__location">
            <MapPin size={14} />
            {kec.kabupaten}, {kec.provinsi}
          </p>
        </div>
        <div class="detail__hero-badges">
          <span class="badge badge--blue">{kec.negaraTetangga}</span>
          <span class="badge badge--green">{kec.plbn}</span>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <nav class="detail__tabs" aria-label="Kategori data">
      {#each tabs as tab}
        <button
          class="detail__tab"
          class:active={activeTab === tab.id}
          onclick={() => (activeTab = tab.id)}
          style="--tab-color: {tab.color}"
        >
          <tab.icon size={16} />
          <span>{tab.label}</span>
        </button>
      {/each}
    </nav>

    <!-- Tab Content -->
    <div class="detail__content animate-fade-in" style="--key: {activeTab}">
      {#key activeTab}
        <!-- PERTANIAN -->
        {#if activeTab === 'pertanian'}
          <div class="detail__panel animate-fade-in">
            <div class="detail__panel-stats">
              <StatCard
                icon={Wheat}
                label="Total Luas Tanam"
                value={calculateTotal(kec.pertanian, 'luasTanam')}
                unit="ha"
                color="var(--accent-green)"
                delay={0}
              />
              <StatCard
                icon={Sprout}
                label="Total Produksi"
                value={calculateTotal(kec.pertanian, 'produksi')}
                unit="ton"
                color="var(--accent-green)"
                delay={100}
              />
            </div>

            <div class="detail__panel-charts">
              <BarChart
                title="Produksi Pertanian per Komoditas"
                labels={pertanianChart.labels}
                datasets={pertanianChart.datasets}
              />
            </div>

            <CommodityTable
              title="Detail Komoditas Pertanian"
              data={kec.pertanian}
              columns={pertanianCols}
              category="pertanian"
            />
          </div>

        <!-- PERKEBUNAN -->
        {:else if activeTab === 'perkebunan'}
          <div class="detail__panel animate-fade-in">
            <div class="detail__panel-stats">
              <StatCard
                icon={TreePine}
                label="Total Luas Areal"
                value={calculateTotal(kec.perkebunan, 'luasAreal')}
                unit="ha"
                color="var(--accent-orange)"
                delay={0}
              />
              <StatCard
                icon={TreePine}
                label="Total Produksi"
                value={calculateTotal(kec.perkebunan, 'produksi')}
                unit="ton"
                color="var(--accent-orange)"
                delay={100}
              />
            </div>

            <div class="detail__panel-charts">
              <DoughnutChart
                title="Distribusi Luas Areal Perkebunan"
                labels={perkebunanDonut.labels}
                values={perkebunanDonut.values}
                centerLabel="Total Hektar"
              />
              <BarChart
                title="Jumlah Petani per Komoditas"
                labels={perkebunanPetaniChart.labels}
                datasets={perkebunanPetaniChart.datasets}
              />
            </div>

            <CommodityTable
              title="Detail Komoditas Perkebunan"
              data={kec.perkebunan}
              columns={perkebunanCols}
              category="perkebunan"
            />
          </div>

        <!-- PETERNAKAN -->
        {:else if activeTab === 'peternakan'}
          <div class="detail__panel animate-fade-in">
            <div class="detail__panel-stats">
              <StatCard
                icon={Beef}
                label="Total Populasi Ternak"
                value={calculateTotal(kec.peternakan, 'populasi')}
                unit="ekor"
                color="var(--accent-purple)"
                delay={0}
              />
              <StatCard
                icon={MilkOff}
                label="Total Produksi Daging"
                value={calculateTotal(kec.peternakan, 'produksiDaging')}
                unit="ton"
                color="var(--accent-purple)"
                delay={100}
              />
            </div>

            <div class="detail__panel-charts">
              <BarChart
                title="Populasi per Jenis Ternak"
                labels={peternakanChart.labels}
                datasets={peternakanChart.datasets}
              />
              <DoughnutChart
                title="Distribusi Produksi Daging"
                labels={peternakanDonut.labels}
                values={peternakanDonut.values}
                centerLabel="Total Ton"
              />
            </div>

            <CommodityTable
              title="Detail Data Peternakan"
              data={kec.peternakan}
              columns={peternakanCols}
              category="peternakan"
            />
          </div>

        <!-- KEPENDUDUKAN -->
        {:else if activeTab === 'kependudukan'}
          <div class="detail__panel animate-fade-in">
            <div class="detail__panel-charts">
              <PopulationInfo penduduk={kec.penduduk} />
              <DoughnutChart
                title="Komposisi Penduduk"
                labels={pendudukDonut.labels}
                values={pendudukDonut.values}
                centerLabel="Total Jiwa"
              />
            </div>

            <AdminInfo
              administrasi={kec.administrasi}
              plbn={kec.plbn}
              negaraTetangga={kec.negaraTetangga}
            />
          </div>
        {/if}
      {/key}
    </div>
  </div>
{:else}
  <div class="detail__not-found">
    <h2>Kecamatan tidak ditemukan</h2>
    <p>ID kecamatan "{kecId}" tidak tersedia dalam database.</p>
    <a href="/" class="detail__back-link">← Kembali ke Dashboard</a>
  </div>
{/if}

<style>
  .detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    max-width: 1100px;
  }

  .detail__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .detail__back {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 0.82rem;
    color: var(--text-secondary);
    transition: color var(--transition-fast);
    width: fit-content;
  }

  .detail__back:hover {
    color: var(--accent-green);
  }

  .detail__hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .detail__hero-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail__name {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0;
    color: var(--accent-navy);
  }

  .detail__location {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
    font-size: 0.88rem;
  }

  .detail__hero-badges {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  /* Tabs */
  .detail__tabs {
    display: flex;
    gap: var(--space-xs);
    border-bottom: 1px solid var(--border-glass);
    padding-bottom: 0;
    overflow-x: auto;
  }

  .detail__tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
    border-bottom: 2px solid transparent;
    transition: all var(--transition-fast);
    white-space: nowrap;
    position: relative;
    bottom: -1px;
  }

  .detail__tab:hover {
    color: var(--text-primary);
    background: hsl(210, 31%, 96%);
  }

  .detail__tab.active {
    color: var(--tab-color);
    border-bottom-color: var(--tab-color);
  }

  /* Content */
  .detail__content {
    min-height: 400px;
  }

  .detail__panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    animation: fadeIn 0.35s ease both;
  }

  .detail__panel-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .detail__panel-charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  /* Not Found */
  .detail__not-found {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--text-secondary);
  }

  .detail__not-found h2 {
    font-size: 1.5rem;
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
  }

  .detail__back-link {
    display: inline-block;
    margin-top: var(--space-md);
    color: var(--accent-green);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .detail__panel-stats {
      grid-template-columns: 1fr;
    }

    .detail__panel-charts {
      grid-template-columns: 1fr;
    }

    .detail__name {
      font-size: 1.5rem;
    }

    .detail__tab {
      padding: 0.6rem 0.8rem;
      font-size: 0.8rem;
    }
  }
</style>
