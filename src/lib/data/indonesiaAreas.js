// @ts-nocheck
import provincesCsv from 'idn-area-data/data/provinces.csv?raw';
import regenciesCsv from 'idn-area-data/data/regencies.csv?raw';
import districtsCsv from 'idn-area-data/data/districts.csv?raw';

function parseCsv(csv) {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return rows
    .filter(Boolean)
    .map((row) => {
      const values = row.split(',');
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
}

const provinceCentroids = {
  '11': [4.6951, 96.7494],
  '12': [2.1154, 99.5451],
  '13': [-0.7399, 100.8000],
  '14': [0.2933, 101.7068],
  '15': [-1.4852, 102.4381],
  '16': [-3.3194, 103.9144],
  '17': [-3.5778, 102.3464],
  '18': [-4.5586, 105.4068],
  '19': [-2.7411, 106.4406],
  '21': [3.9457, 108.1429],
  '31': [-6.2088, 106.8456],
  '32': [-6.9147, 107.6098],
  '33': [-7.1509, 110.1403],
  '34': [-7.7956, 110.3695],
  '35': [-7.5361, 112.2384],
  '36': [-6.4058, 106.0640],
  '51': [-8.3405, 115.0920],
  '52': [-8.6529, 117.3616],
  '53': [-8.6574, 121.0794],
  '61': [-0.2788, 111.4753],
  '62': [-1.6815, 113.3824],
  '63': [-3.0926, 115.2838],
  '64': [0.5387, 116.4194],
  '65': [3.0731, 116.0414],
  '71': [1.4931, 124.8413],
  '72': [-1.4300, 121.4456],
  '73': [-3.6688, 119.9741],
  '74': [-4.1449, 122.1746],
  '75': [0.6999, 122.4467],
  '76': [-2.8441, 119.2321],
  '81': [-3.2385, 130.1453],
  '82': [1.5709, 127.8088],
  '91': [-1.3361, 133.1747],
  '92': [-1.3842, 132.9025],
  '93': [-4.2699, 138.0804],
  '94': [-2.5337, 140.7181],
  '95': [-3.9886, 137.3795],
  '96': [-4.3437, 135.4970],
  '97': [-1.0527, 138.9550],
};

export const indonesiaProvinces = parseCsv(provincesCsv);
export const indonesiaRegencies = parseCsv(regenciesCsv);
export const indonesiaDistricts = parseCsv(districtsCsv);

export const nationalAreaSummary = {
  provinceCount: indonesiaProvinces.length,
  regencyCount: indonesiaRegencies.length,
  districtCount: indonesiaDistricts.length,
};

export const provinceSummaries = indonesiaProvinces.map((province) => {
  const regencies = indonesiaRegencies.filter((regency) => regency.province_code === province.code);
  const regencyCodes = new Set(regencies.map((regency) => regency.code));
  const districts = indonesiaDistricts.filter((district) => regencyCodes.has(district.regency_code));

  return {
    code: province.code,
    name: province.name,
    regencyCount: regencies.length,
    districtCount: districts.length,
    coordinates: provinceCentroids[province.code] ?? [-2.5, 118],
  };
});

export const topProvinceSummaries = [...provinceSummaries]
  .sort((a, b) => b.districtCount - a.districtCount)
  .slice(0, 8);
