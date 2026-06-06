<script>
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import { formatNumber } from '$lib/utils/formatters.js';

  /** @type {{ provinces: Array<{ code: string, name: string, regencyCount: number, districtCount: number, coordinates: number[] }> }} */
  let { provinces = [] } = $props();

  /** @type {HTMLDivElement} */
  let mapEl;

  onMount(() => {
    let disposed = false;
    /** @type {import('leaflet').Map | undefined} */
    let map;

    import('leaflet').then((L) => {
      if (disposed) return;

      map = L.map(mapEl, {
        center: [-2.5, 118],
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution:
            'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
        }
      ).addTo(map);

      const markerLayer = L.featureGroup().addTo(map);

      for (const province of provinces) {
        const radius = Math.max(7, Math.min(22, province.districtCount / 28));
        L.circleMarker(province.coordinates, {
          radius,
          color: '#ffffff',
          weight: 2.5,
          fillColor: '#f59e0b',
          fillOpacity: 0.82,
        })
          .bindPopup(
            `<strong>${province.name}</strong><br>${formatNumber(province.regencyCount)} kab/kota<br>${formatNumber(province.districtCount)} kecamatan`
          )
          .addTo(markerLayer);
      }

      if (provinces.length) {
        map.fitBounds(markerLayer.getBounds().pad(0.12));
      }
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  });
</script>

<div class="map-card glass-card">
  <div class="map-card__header">
    <div>
      <h4>Map Sebaran Kecamatan Indonesia</h4>
      <p>Marker agregat per provinsi dari dataset wilayah nasional.</p>
    </div>
    <span>{formatNumber(provinces.length)} provinsi</span>
  </div>
  <div class="map-card__canvas" bind:this={mapEl}></div>
</div>

<style>
  .map-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 430px;
  }

  .map-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-bottom: 1px solid var(--border-glass);
    background: hsl(210, 40%, 99%);
  }

  .map-card__header h4 {
    color: var(--accent-navy);
    font-size: 1rem;
  }

  .map-card__header p {
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin-top: 2px;
  }

  .map-card__header span {
    flex-shrink: 0;
    color: var(--accent-green);
    background: var(--accent-green-soft);
    border: 1px solid hsla(156, 71%, 31%, 0.16);
    border-radius: var(--radius-sm);
    font-size: 0.76rem;
    font-weight: 700;
    padding: 0.22rem 0.55rem;
  }

  .map-card__canvas {
    height: 360px;
    width: 100%;
    background: hsl(210, 31%, 96%);
    z-index: 0;
  }

  :global(.leaflet-container) {
    font-family: var(--font-family);
  }

  :global(.leaflet-popup-content-wrapper) {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }

  :global(.leaflet-popup-content) {
    color: var(--text-secondary);
    font-size: 0.78rem;
    line-height: 1.45;
  }

  :global(.leaflet-popup-content strong) {
    color: var(--accent-navy);
    font-size: 0.86rem;
  }

  @media (max-width: 640px) {
    .map-card {
      min-height: 380px;
    }

    .map-card__header {
      flex-direction: column;
    }

    .map-card__canvas {
      height: 300px;
    }
  }
</style>
