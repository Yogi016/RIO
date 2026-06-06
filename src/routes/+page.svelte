<script>
  import { kecamatanList, summaryStats } from '$lib/stores/kecamatan.js';
  import { calculateTotal } from '$lib/utils/formatters.js';
  import StatCard from '$lib/components/StatCard.svelte';
  import KecamatanCard from '$lib/components/KecamatanCard.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import DoughnutChart from '$lib/components/DoughnutChart.svelte';
  import IndonesiaMap from '$lib/components/IndonesiaMap.svelte';
  import {
    indonesiaDistricts,
    nationalAreaSummary,
    provinceSummaries,
    topProvinceSummaries,
  } from '$lib/data/indonesiaAreas.js';
  import { MapPin, Users, Wheat, Database, Building2, Landmark, Layers3 } from '@lucide/svelte';

  /** @type {{ data: { kecamatanList: Array } }} */
  let { data } = $props();

  // Hydrate the store from server-loaded data (Supabase or static fallback)
  $effect(() => {
    if (data?.kecamatanList) {
      kecamatanList.set(data.kecamatanList);
    }
  });

  // Chart Data: Perbandingan Produksi Pertanian Antar Kecamatan
  const pertanianChartData = $derived({
    labels: $kecamatanList.map((k) => k.nama),
    datasets: [
      {
        label: 'Produksi Pertanian (ton)',
        data: $kecamatanList.map((k) => calculateTotal(k.pertanian, 'produksi')),
      },
    ],
  });

  // Chart Data: Komposisi Komoditas Perkebunan
  const perkebunanLabels = $derived(() => {
    const allKomoditas = new Set();
    $kecamatanList.forEach((k) =>
      k.perkebunan.forEach((p) => allKomoditas.add(p.komoditas))
    );
    return [...allKomoditas];
  });

  const perkebunanValues = $derived(() => {
    const labels = perkebunanLabels();
    return labels.map((label) =>
      $kecamatanList.reduce((sum, k) => {
        const item = k.perkebunan.find((p) => p.komoditas === label);
        return sum + (item?.luasAreal || 0);
      }, 0)
    );
  });

  // Chart Data: Populasi Ternak Antar Kecamatan
  const ternakChartData = $derived({
    labels: $kecamatanList.map((k) => k.nama),
    datasets: [
      {
        label: 'Populasi Ternak',
        data: $kecamatanList.map((k) => calculateTotal(k.peternakan, 'populasi')),
      },
    ],
  });

  const comparisonRows = $derived(
    $kecamatanList.map((k) => ({
      ...k,
      totalPertanian: calculateTotal(k.pertanian, 'produksi'),
      totalPerkebunan: calculateTotal(k.perkebunan, 'luasAreal'),
      totalTernak: calculateTotal(k.peternakan, 'populasi'),
    }))
  );

  const districtExamples = indonesiaDistricts.slice(0, 10);
</script>

<svelte:head>
  <title>Dashboard — RIO Potensi Perbatasan Darat</title>
</svelte:head>

<div class="dashboard">
  <header class="dashboard__header animate-fade-in-up">
    <div class="dashboard__header-main">
      <div class="dashboard__ministry">
        <img src="/logo.svg" alt="Logo Kementerian" />
        <div>
          <span>Kementerian Dalam Negeri</span>
          <strong>Republik Indonesia</strong>
        </div>
      </div>
      <div>
        <h1 class="dashboard__title">Dashboard Wilayah Nasional</h1>
        <p class="dashboard__desc">
          Pemantauan potensi wilayah Indonesia dengan data kecamatan nasional
          dan dummy indikator potensi yang mengikuti struktur publikasi BPS.
        </p>
      </div>
    </div>
    <div class="dashboard__source-card">
      <Database size={18} />
      <div>
        <span>Sumber Data</span>
        <strong>idn-area-data + BPS-like dummy</strong>
      </div>
    </div>
  </header>

  <section class="dashboard__overview" aria-label="Ikhtisar data">
    <div class="dashboard__overview-main">
      <span class="dashboard__label">RIO Kemendagri Data Portal</span>
      <h2>Monitoring cepat data kecamatan seluruh Indonesia.</h2>
      <p>
        Data wilayah nasional diambil dari paket statis `idn-area-data`. Angka
        potensi ekonomi tetap dummy untuk kebutuhan tampilan dan mengikuti pola
        indikator BPS: administrasi wilayah, kependudukan, pertanian,
        perkebunan, dan peternakan.
      </p>
    </div>
    <div class="dashboard__overview-side">
      <Building2 size={22} />
      <span>Cakupan Nasional</span>
      <strong>{nationalAreaSummary.provinceCount} provinsi, {nationalAreaSummary.districtCount.toLocaleString('id-ID')} kecamatan</strong>
    </div>
  </section>

  <section class="dashboard__stats" aria-label="Ringkasan statistik">
    <StatCard
      icon={MapPin}
      label="Provinsi"
      value={nationalAreaSummary.provinceCount}
      unit="provinsi"
      color="var(--accent-cyan)"
      delay={0}
    />
    <StatCard
      icon={Landmark}
      label="Kab/Kota"
      value={nationalAreaSummary.regencyCount}
      unit="wilayah"
      color="var(--accent-blue)"
      delay={80}
    />
    <StatCard
      icon={Layers3}
      label="Kecamatan Nasional"
      value={nationalAreaSummary.districtCount}
      unit="kecamatan"
      color="var(--accent-green)"
      delay={160}
    />
    <StatCard
      icon={Users}
      label="Penduduk Contoh"
      value={$summaryStats.totalPenduduk}
      unit="jiwa"
      color="var(--accent-orange)"
      delay={240}
    />
  </section>

  <section class="dashboard__map-grid" aria-label="Peta dan agregasi kecamatan Indonesia">
    <IndonesiaMap provinces={provinceSummaries} />

    <div class="dashboard__province-panel glass-card">
      <div class="dashboard__province-head">
        <h3>Provinsi dengan Kecamatan Terbanyak</h3>
        <span>Top 8</span>
      </div>
      <div class="dashboard__province-list">
        {#each topProvinceSummaries as province, i}
          <div class="dashboard__province-row">
            <span>{i + 1}</span>
            <div>
              <strong>{province.name}</strong>
              <small>{province.regencyCount} kab/kota</small>
            </div>
            <b>{province.districtCount.toLocaleString('id-ID')}</b>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="dashboard__section" aria-label="Contoh data kecamatan nasional">
    <div class="dashboard__section-head">
      <div>
        <h2 class="dashboard__section-title">Contoh Data Kecamatan Nasional</h2>
        <p class="dashboard__section-desc">
          Dataset lengkap memuat {nationalAreaSummary.districtCount.toLocaleString('id-ID')} kecamatan; tabel ini menampilkan contoh awal dari data statis.
        </p>
      </div>
    </div>

    <div class="dashboard__table glass-card">
      <table>
        <thead>
          <tr>
            <th>Kode Kecamatan</th>
            <th>Nama Kecamatan</th>
            <th>Kode Kab/Kota</th>
          </tr>
        </thead>
        <tbody>
          {#each districtExamples as district}
            <tr>
              <td><strong>{district.code}</strong></td>
              <td>{district.name}</td>
              <td>{district.regency_code}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="dashboard__charts" aria-label="Grafik ringkasan">
    <BarChart
      title="Perbandingan Produksi Pertanian per Kecamatan"
      labels={pertanianChartData.labels}
      datasets={pertanianChartData.datasets}
    />
    <DoughnutChart
      title="Komposisi Luas Perkebunan"
      labels={perkebunanLabels()}
      values={perkebunanValues()}
      centerLabel="Total Hektar"
    />
  </section>

  <section class="dashboard__charts dashboard__charts--single" aria-label="Grafik peternakan">
    <BarChart
      title="Perbandingan Populasi Ternak per Kecamatan"
      labels={ternakChartData.labels}
      datasets={ternakChartData.datasets}
    />
  </section>

  <section class="dashboard__section" aria-label="Tabel perbandingan kecamatan">
    <div class="dashboard__section-head">
      <div>
        <h2 class="dashboard__section-title">Perbandingan Indikator Wilayah</h2>
        <p class="dashboard__section-desc">
          Data contoh potensi perbatasan untuk pembacaan cepat seperti portal statistik.
        </p>
      </div>
    </div>

    <div class="dashboard__table glass-card">
      <table>
        <thead>
          <tr>
            <th>Kecamatan</th>
            <th>Kabupaten</th>
            <th>Penduduk</th>
            <th>Produksi Pertanian</th>
            <th>Luas Perkebunan</th>
            <th>Populasi Ternak</th>
          </tr>
        </thead>
        <tbody>
          {#each comparisonRows as row}
            <tr>
              <td>
                <strong>{row.nama}</strong>
                <span>{row.plbn}</span>
              </td>
              <td>{row.kabupaten}</td>
              <td>{row.penduduk.jumlahTotal.toLocaleString('id-ID')} jiwa</td>
              <td>{row.totalPertanian.toLocaleString('id-ID')} ton</td>
              <td>{row.totalPerkebunan.toLocaleString('id-ID')} ha</td>
              <td>{row.totalTernak.toLocaleString('id-ID')} ekor</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="dashboard__section" aria-label="Daftar kecamatan">
    <div>
      <h2 class="dashboard__section-title">Kecamatan Perbatasan</h2>
      <p class="dashboard__section-desc">
        Kecamatan contoh untuk detail dummy potensi komoditas dan data kependudukan.
      </p>
    </div>

    <div class="dashboard__grid">
      {#each $kecamatanList as kec, i (kec.id)}
        <KecamatanCard {kec} index={i} />
      {/each}
    </div>
  </section>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 1240px;
  }

  .dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: var(--space-lg);
    padding: var(--space-lg);
    border: 1px solid hsla(151, 72%, 27%, 0.16);
    border-radius: var(--radius-xl);
    background:
      linear-gradient(135deg, hsla(151, 72%, 27%, 0.12), hsla(44, 96%, 55%, 0.16)),
      white;
    box-shadow: var(--shadow-sm);
  }

  .dashboard__header-main {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    max-width: 720px;
  }

  .dashboard__ministry {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-shrink: 0;
  }

  .dashboard__ministry img {
    width: 54px;
    height: 70px;
    object-fit: contain;
  }

  .dashboard__ministry div {
    display: flex;
    flex-direction: column;
    min-width: 150px;
  }

  .dashboard__ministry span {
    color: var(--accent-green);
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dashboard__ministry strong {
    color: var(--accent-navy);
    font-size: 0.88rem;
  }

  .dashboard__title {
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: 0;
    color: var(--accent-navy);
  }

  .dashboard__desc {
    color: var(--text-secondary);
    font-size: 0.92rem;
    margin-top: 4px;
    max-width: 680px;
  }

  .dashboard__source-card {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 230px;
    padding: 0.85rem 1rem;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    background: white;
    color: var(--accent-blue);
    box-shadow: var(--shadow-sm);
  }

  .dashboard__source-card div {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .dashboard__source-card span {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .dashboard__source-card strong {
    color: var(--text-primary);
    font-size: 0.85rem;
  }

  .dashboard__overview {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: var(--space-md);
    padding: 1.25rem;
    border: 1px solid hsla(151, 72%, 27%, 0.18);
    border-radius: var(--radius-lg);
    background:
      linear-gradient(135deg, hsla(214, 67%, 16%, 0.96), hsla(151, 72%, 27%, 0.9)),
      linear-gradient(135deg, hsla(44, 96%, 55%, 0.28), transparent 50%);
    box-shadow: var(--shadow-sm);
  }

  .dashboard__overview-main {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .dashboard__label {
    width: fit-content;
    color: hsl(44, 96%, 72%);
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .dashboard__overview h2 {
    color: white;
    font-size: 1.35rem;
  }

  .dashboard__overview p {
    color: hsla(0, 0%, 100%, 0.78);
    font-size: 0.9rem;
    max-width: 760px;
  }

  .dashboard__overview-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.35rem;
    padding: var(--space-md);
    border-left: 1px solid hsla(0, 0%, 100%, 0.18);
    color: hsl(44, 96%, 72%);
  }

  .dashboard__overview-side span {
    color: hsla(0, 0%, 100%, 0.66);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .dashboard__overview-side strong {
    color: white;
    font-size: 0.95rem;
  }

  .dashboard__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md);
  }

  .dashboard__charts {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: var(--space-md);
  }

  .dashboard__charts--single {
    grid-template-columns: 1fr;
  }

  .dashboard__map-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: var(--space-md);
  }

  .dashboard__province-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dashboard__province-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-bottom: 1px solid var(--border-glass);
    background: hsl(210, 40%, 99%);
  }

  .dashboard__province-head h3 {
    color: var(--accent-navy);
    font-size: 1rem;
  }

  .dashboard__province-head span {
    color: var(--accent-blue);
    font-size: 0.74rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .dashboard__province-list {
    display: flex;
    flex-direction: column;
  }

  .dashboard__province-row {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-sm);
    padding: 0.78rem var(--space-lg);
    border-bottom: 1px solid hsl(214, 24%, 91%);
  }

  .dashboard__province-row > span {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    background: var(--accent-navy-soft);
    color: var(--accent-navy);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .dashboard__province-row div {
    min-width: 0;
  }

  .dashboard__province-row strong,
  .dashboard__province-row small {
    display: block;
  }

  .dashboard__province-row strong {
    color: var(--text-primary);
    font-size: 0.86rem;
  }

  .dashboard__province-row small {
    color: var(--text-muted);
    font-size: 0.72rem;
  }

  .dashboard__province-row b {
    color: var(--accent-green);
    font-size: 0.9rem;
  }

  .dashboard__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .dashboard__section-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .dashboard__section-title {
    font-size: 1.3rem;
    color: var(--accent-navy);
  }

  .dashboard__section-desc {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-top: -4px;
  }

  .dashboard__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
  }

  .dashboard__table {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.84rem;
  }

  th {
    padding: 0.78rem 1rem;
    background: hsl(210, 31%, 96%);
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 800;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
    border-bottom: 1px solid var(--border-glass);
  }

  td {
    padding: 0.8rem 1rem;
    color: var(--text-secondary);
    white-space: nowrap;
    border-bottom: 1px solid hsl(214, 24%, 91%);
  }

  td strong,
  td span {
    display: block;
  }

  td strong {
    color: var(--text-primary);
    font-size: 0.88rem;
  }

  td span {
    color: var(--text-muted);
    font-size: 0.74rem;
    margin-top: 2px;
  }

  tbody tr:hover {
    background: hsl(210, 40%, 98%);
  }

  @media (max-width: 1024px) {
    .dashboard__stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .dashboard__charts {
      grid-template-columns: 1fr;
    }

    .dashboard__map-grid {
      grid-template-columns: 1fr;
    }

    .dashboard__overview {
      grid-template-columns: 1fr;
    }

    .dashboard__overview-side {
      border-left: 0;
      border-top: 1px solid var(--border-glass);
      padding-left: 0;
    }

    .dashboard__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .dashboard__stats {
      grid-template-columns: 1fr;
    }

    .dashboard__grid {
      grid-template-columns: 1fr;
    }

    .dashboard__title {
      font-size: 1.4rem;
    }

    .dashboard__header {
      flex-direction: column;
    }

    .dashboard__header-main {
      align-items: flex-start;
      flex-direction: column;
    }

    .dashboard__source-card {
      width: 100%;
    }
  }
</style>
