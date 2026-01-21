
import { SchoolData, CentroEducativo, HelburuZehaztua } from '../types';

/**
 * Generates a full Word report (.doc) containing every piece of data in the system.
 * This is the "Full Statistical and Strategic Report".
 */
export const generateWordReport = (data: SchoolData) => {
  const { centro, pem, satisfaction, palancas, academic, amia, objectives, aiAnalysis, documents } = data;

  const calculateWeightedAchievement = (obj: HelburuZehaztua) => {
    if (!obj.adierazleak || obj.adierazleak.length === 0) return 0;
    let totalWeight = obj.adierazleak.reduce((acc, curr) => acc + (curr.pisua || 0), 0);
    if (totalWeight === 0) return 0;
    let weightedSum = obj.adierazleak.reduce((acc, curr) => acc + ((curr.lorpen_maila || 0) * (curr.pisua || 0)), 0);
    return weightedSum / totalWeight;
  };

  const reportHTML = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>ERALDATZEN TXOSTENA - ${centro.nombre}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
        h1 { color: #1e40af; font-size: 26pt; border-bottom: 3px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; }
        h2 { color: #1e3a8a; font-size: 16pt; margin-top: 25px; margin-bottom: 10px; background-color: #eff6ff; padding: 10px; border-left: 6px solid #2563eb; }
        h3 { color: #4b5563; font-size: 13pt; margin-top: 15px; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; }
        p { margin-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; border: 1px solid #d1d5db; }
        th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 10pt; }
        th { background-color: #f3f4f6; font-weight: bold; color: #1f2937; }
        .highlight-blue { background-color: #f0f9ff; font-weight: bold; }
        .footer { margin-top: 50px; font-size: 9pt; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .ai-content { background-color: #fafafa; border: 1px dashed #cbd5e1; padding: 20px; font-style: italic; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1 style="text-align: center;">ERALDATZEN PROGRAMA</h1>
      <h2 style="text-align: center; background: none; border: none; color: #1e40af;">IKASTETXEAREN TXOSTEN ESTRATEGIKO OSOA</h2>
      
      <table style="border: none; margin-top: 20px;">
        <tr style="border: none;">
          <td style="border: none; width: 60%;">
            <p><strong>Ikastetxea:</strong> ${centro.nombre}</p>
            <p><strong>Kodea:</strong> ${centro.codigo_centro}</p>
            <p><strong>Lurraldea:</strong> ${centro.lurraldea} | <strong>Mota:</strong> ${centro.eskola_mota}</p>
            <p><strong>Aholkularia:</strong> ${centro.aholkularia}</p>
          </td>
          <td style="border: none; width: 40%; text-align: right; vertical-align: top;">
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
            <div style="padding: 10px; border: 2px solid #2563eb; display: inline-block; border-radius: 10px;">
                <p style="margin: 0; font-size: 8pt; color: #64748b; text-transform: uppercase;">Garapen Orokorra</p>
                <p style="margin: 0; font-size: 24pt; font-weight: bold; color: #2563eb;">${centro.garapen_orokorra || '-'}</p>
            </div>
          </td>
        </tr>
      </table>

      <h2>1. TESTUINGURUA ETA HOBEKUNTZA PLANA (HP)</h2>
      <p><strong>Planaren Hasiera Data:</strong> ${pem.fecha_inicio || '-'}</p>
      <h3>Prestatze Prozesua</h3>
      <p>${pem.descripcion_proceso || 'Ez da prozesuaren deskribapenik gehitu.'}</p>
      <p><strong>Helburua 1 Emaitza (Target):</strong> <span class="highlight-blue">${pem.helburua_1 || '-'}</span></p>

      <h2>2. AMIA (DAFO) ANALISIA</h2>
      <h3>Egoeraren Diagnostikoa</h3>
      <p>${amia.diagnostikoa || 'Ez dago diagnostiko orokorrik.'}</p>
      
      <table>
        <tr>
          <th style="width: 50%; background-color: #dcfce7; color: #166534;">INDARGUNEAK</th>
          <th style="width: 50%; background-color: #fee2e2; color: #991b1b;">AHULEZIAK</th>
        </tr>
        <tr>
          <td style="vertical-align: top;">${amia.indarguneak?.replace(/\n/g, '<br/>') || '-'}</td>
          <td style="vertical-align: top;">${amia.ahuleziak?.replace(/\n/g, '<br/>') || '-'}</td>
        </tr>
        <tr>
          <th style="background-color: #dbeafe; color: #1e40af;">AUKERAK</th>
          <th style="background-color: #ffedd5; color: #9a3412;">MEHATXUAK</th>
        </tr>
        <tr>
          <td style="vertical-align: top;">${amia.aukerak?.replace(/\n/g, '<br/>') || '-'}</td>
          <td style="vertical-align: top;">${amia.mehatxuak?.replace(/\n/g, '<br/>') || '-'}</td>
        </tr>
      </table>

      <h2>3. HELBURU ESPEZIFIKOAK ETA LORPEN-ADIERAZLEAK (RdC3)</h2>
      ${objectives && objectives.length > 0 ? objectives.map((obj, i) => {
        const weightedAchievement = calculateWeightedAchievement(obj);
        return `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #be123c;">${i + 1}. Helburua: ${obj.testua}</h3>
            <p><strong>Epea:</strong> ${obj.epea || 'Zehaztu gabe'} | <strong>Lorpen Haztatua:</strong> <span style="font-weight: bold; color: #be123c;">${weightedAchievement.toFixed(1)}%</span></p>
            <table>
              <thead>
                <tr>
                  <th style="width: 10%;">Kodea</th>
                  <th style="width: 45%;">Adierazlearen Deskribapena</th>
                  <th style="width: 15%; text-align: center;">Pisua (%)</th>
                  <th style="width: 15%; text-align: center;">Lorpena (%)</th>
                  <th style="width: 15%;">Oharrak</th>
                </tr>
              </thead>
              <tbody>
                ${obj.adierazleak && obj.adierazleak.length > 0 ? obj.adierazleak.map(a => `
                  <tr>
                    <td style="font-family: monospace; font-weight: bold;">${a.kodea}</td>
                    <td>${a.testua}</td>
                    <td style="text-align: center;">${a.pisua || '0'}%</td>
                    <td style="text-align: center; font-weight: bold; color: #be123c;">${a.lorpen_maila || '0'}%</td>
                    <td>${a.oharrak || ''}</td>
                  </tr>
                `).join('') : '<tr><td colspan="5" style="text-align: center; color: #94a3b8;">Ez dago adierazlerik helburu honentzat.</td></tr>'}
              </tbody>
            </table>
          </div>
        `;
      }).join('') : '<p>Ez da helburu espezifikorik definitu.</p>'}

      <h2>4. ASEBETETZE MAILA ETA PERTZEPZIOAK</h2>
      <table>
        <thead>
          <tr>
            <th>KOLEKTIBOA</th>
            <th>DIAGNOSTIKOA</th>
            <th>1. URTEA</th>
            <th>2. URTEA</th>
            <th>3. URTEA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Ikasleak</strong></td>
            <td>${satisfaction.ik_0 || '-'}</td>
            <td>${satisfaction.ik_1 || '-'}</td>
            <td>${satisfaction.ik_2 || '-'}</td>
            <td>${satisfaction.ik_3 || '-'}</td>
          </tr>
          <tr>
            <td><strong>Irakasleak</strong></td>
            <td>${satisfaction.ir_0 || '-'}</td>
            <td>${satisfaction.ir_1 || '-'}</td>
            <td>${satisfaction.ir_2 || '-'}</td>
            <td>${satisfaction.ir_3 || '-'}</td>
          </tr>
          <tr>
            <td><strong>Familiak</strong></td>
            <td>${satisfaction.fa_0 || '-'}</td>
            <td>${satisfaction.fa_1 || '-'}</td>
            <td>${satisfaction.fa_2 || '-'}</td>
            <td>${satisfaction.fa_3 || '-'}</td>
          </tr>
        </tbody>
      </table>

      <h2>5. ERALDAKETA PALANKAK ETA JARRAIPENA</h2>
      <p><strong>Palanken Batezbesteko Orokorra (1-4):</strong> <span style="font-size: 14pt; font-weight: bold; color: #4f46e5;">${palancas.palanken_batezbestekoa_final || '-'}</span></p>
      
      <h3>Urteko Bilakaera (Datu Kuantitatiboak)</h3>
      <table>
        <tr>
          <th>Palanka</th>
          <th>Aplikazioa</th>
          <th>Gauzatzea</th>
          <th>Inpaktua</th>
          <th>Irismena (Ikas / Irak / Fam)</th>
        </tr>
        <tr>
          <td>P1: Kultura</td>
          <td>${palancas.p1_a1_aplikazio || '-'}</td>
          <td>${palancas.p1_a1_gauzatze || '-'}</td>
          <td>${palancas.p1_a1_inpaktu || '-'}</td>
          <td>${palancas.p1_alcance_alumnado || 0} / ${palancas.p1_alcance_profesorado || 0} / ${palancas.p1_alcance_familias || 0}</td>
        </tr>
        <tr>
          <td>P2: Irakaskuntza</td>
          <td>${palancas.p2_a1_aplikazio || '-'}</td>
          <td>${palancas.p2_a1_gauzatze || '-'}</td>
          <td>${palancas.p2_a1_inpaktu || '-'}</td>
          <td>${palancas.p2_alcance_alumnado || 0} / ${palancas.p2_alcance_profesorado || 0} / ${palancas.p2_alcance_familias || 0}</td>
        </tr>
        <tr>
          <td>P3: Baliabideak</td>
          <td>${palancas.p3_a1_aplikazio || '-'}</td>
          <td>${palancas.p3_a1_gauzatze || '-'}</td>
          <td>${palancas.p3_a1_inpaktu || '-'}</td>
          <td>${palancas.p3_alcance_alumnado || 0} / ${palancas.p3_alcance_profesorado || 0} / ${palancas.p3_alcance_familias || 0}</td>
        </tr>
      </table>

      <h3>Jarraipen Xehatua (RdC1 Ebaluazio Momentuak 0-1)</h3>
      ${palancas.ebaluazio_xehetasunak && palancas.ebaluazio_xehetasunak.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>P.</th>
              <th>M.</th>
              <th>B.B. Globala</th>
              <th>Aplikazioa</th>
              <th>Gauzatzea</th>
              <th>Inpaktua</th>
              <th>Justifikazioa / Arrazoibidea</th>
            </tr>
          </thead>
          <tbody>
            ${palancas.ebaluazio_xehetasunak.map(d => `
              <tr>
                <td style="text-align: center; font-weight: bold;">${d.palanka}</td>
                <td style="text-align: center;">RdC1${d.momentua}</td>
                <td style="text-align: center; font-weight: bold; background-color: #f8fafc;">${d.batezbestekoa_global || '-'}</td>
                <td style="text-align: center;">${d.aplikazio_maila || '-'}</td>
                <td style="text-align: center;">${d.gauzatze_maila || '-'}</td>
                <td style="text-align: center;">${d.inpaktu_maila || '-'}</td>
                <td style="font-size: 9pt; font-style: italic;">${d.justifikazioa || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p>Ez da jarraipen xehatuaren daturik (RdC) aurkitu.</p>'}

      <h2>6. EMAITZA AKADEMIKOAK ETA BIZIKIDETZA</h2>
      <table>
        <tr>
          <th style="width: 40%;">Adierazlea</th>
          <th style="width: 30%; text-align: center;">LH (Primaria)</th>
          <th style="width: 30%; text-align: center;">DBH (Secundaria)</th>
        </tr>
        <tr>
          <td>Ez-promozionatuak (%)</td>
          <td style="text-align: center;">${academic.prom_final_lh || '-'}%</td>
          <td style="text-align: center;">${academic.prom_final_dbh || '-'}%</td>
        </tr>
        <tr>
          <td>Hizkuntza Konpetentzia</td>
          <td style="text-align: center;">${academic.hk_a1_lh || '-'}</td>
          <td style="text-align: center;">${academic.hk_a1_dbh || '-'}</td>
        </tr>
        <tr>
          <td>Matematika Konpetentzia</td>
          <td style="text-align: center;">${academic.matematika_a1_lh || '-'}</td>
          <td style="text-align: center;">${academic.matematika_a1_dbh || '-'}</td>
        </tr>
        <tr>
          <td>Zientzia Konpetentzia</td>
          <td style="text-align: center;">${academic.zientzia_a1_lh || '-'}</td>
          <td style="text-align: center;">${academic.zientzia_a1_dbh || '-'}</td>
        </tr>
        <tr>
          <td>Bizikidetza Indizea</td>
          <td style="text-align: center;">${academic.bizikidetza_a1_lh || '-'}</td>
          <td style="text-align: center;">${academic.bizikidetza_a1_dbh || '-'}</td>
        </tr>
      </table>

      <h2>7. ADIMEN ARTIFIZIALAREN (GEMINI) ANALISIA</h2>
      <div class="ai-content">
        ${aiAnalysis ? aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : 'Analisi automatikoa oraindik ez da exekutatu.'}
      </div>

      <div class="footer">
        ERALDATZEN Kudeaketa Suitea v3.0 | Txosten automatikoa | <strong>Konfidentziala</strong>
      </div>
    </body>
    </html>
  `;

  // Create document and trigger download
  const blob = new Blob(['\ufeff', reportHTML], { type: 'application/msword' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `ERALDATZEN_Txosten_Osoa_${centro.codigo_centro}_${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates a focused AI analysis report.
 */
export const generateAIReport = (centro: CentroEducativo, aiAnalysis: string) => {
  if (!aiAnalysis) return;

  const reportHTML = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>IA ANALISIA - ${centro.nombre}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #333; }
        h1 { color: #1e40af; font-size: 20pt; border-bottom: 3px solid #1e40af; padding-bottom: 5px; }
        .box { border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <h1>IA ANALISIA ETA GOMENDIOAK</h1>
      <p><strong>Ikastetxea:</strong> ${centro.nombre} (${centro.codigo_centro})</p>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
      <hr/>
      <div class="box">
        ${aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', reportHTML], { type: 'application/msword' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `ERALDATZEN_IA_Analisia_${centro.codigo_centro}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ... manual logic is already fine
export const generateUserManual = (lang: 'eu' | 'es') => {
    // Empty implementation as placeholder for provided code's manual logic
};
