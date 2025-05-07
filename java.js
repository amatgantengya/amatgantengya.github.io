    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
      import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
      
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
      apiKey: "AIzaSyBhc9q5m-3mymmEPtCo_cccTXCqSCGdpqA",
      authDomain: "hacker-archive.firebaseapp.com",
      databaseURL: "https://hacker-archive-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "hacker-archive",
      storageBucket: "hacker-archive.firebasestorage.app",
       messagingSenderId: "597551731880",
        appId: "1:597551731880:web:712147413b7c1bb66c5e9d",
      measurementId: "G-NLXWQ34843"
};

      
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const analytics = getAnalytics(app);
      const archivesRef = ref(database, 'archives');
      const jumlahArchiveElement = document.getElementById('jumlahArchive');
      const topAttackerElement = document.getElementById('topAttacker');

      function escapeHtml(unsafe) {
          return unsafe
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
       }

      async function simpanArchiveBaru() {
          const pocInput = document.getElementById('poc');
          const attackerInput = document.getElementById('attacker');
          const teamInput = document.getElementById('team');
          const urlInput = document.getElementById('hackedUrl');

          const poc = pocInput.value.trim();
          const attacker = attackerInput.value.trim();
          const team = teamInput.value.trim();
          const url = urlInput.value.trim();

          if (poc || attacker || team || url) {
              const newEntry = {
                  poc: poc,
                  attacker: attacker,
                  team: team,
                  urls: url ? [url] : []
              };

              try {
                  const pushedRef = await push(archivesRef, newEntry);
                  const reportId = pushedRef.key; // Dapatkan ID unik dari Firebase

                  pocInput.value = '';
                  attackerInput.value = '';
                  teamInput.value = '';
                  urlInput.value = '';

                  
                  const detailUrl = `detail.html?id=${reportId}`;
                  alert(`Laporan berhasil ditambahkan. Anda bisa melihat dan membagikan tautan ini: ${detailUrl}`);

                  muatSemuaArchive(); 

              } catch (error) {
                  console.error("Error:", error);
                  alert("Gagal menyimpan.");
              }
          } else {
              alert("Harap masukkan setidaknya satu informasi (PoC, Attacker, Team, atau URL).");
          }
      }

      async function muatSemuaArchive() {
          const allArchiveContainer = document.getElementById('allArchiveContainer');
          allArchiveContainer.innerHTML = '<p>Memuat archive...</p>';

          try {
              const snapshot = await get(archivesRef);
              const archives = snapshot.val();
              let html = '';
              let jumlah = 0;
              const attackerCounts = {};
              let topAttacker = '';
              let maxCount = 0;

              if (archives) {
                  jumlah = Object.keys(archives).length;
                  Object.entries(archives).forEach(([key, entry], index) => {
                      html += `<div><h4>gabutnya#${index + 1}</h4>`;
                      if (entry.poc) {
                          html += `<p><strong>PoC:</strong> <span>${escapeHtml(entry.poc)}</span></p>`;
                      }
                      if (entry.attacker) {
                          const escapedAttacker = escapeHtml(entry.attacker);
                          html += `<p><strong>attacker:</strong> <span>${escapedAttacker}</span></p>`;
                          attackerCounts[escapedAttacker] = (attackerCounts[escapedAttacker] || 0) + 1;
                          if (attackerCounts[escapedAttacker] > maxCount) {
                              maxCount = attackerCounts[escapedAttacker];
                              topAttacker = escapedAttacker;
                          }
                      }
                      if (entry.team) {
                          html += `<p><strong>Team:</strong> <span>${escapeHtml(entry.team)}</span></p>`;
                      }
                      if (entry.urls && entry.urls.length > 0) {
                          html += `<p><strong>Diretas:</strong></p><ul>`;
                          entry.urls.forEach(url => {
                              html += `<li><b><a href="${escapeHtml(url)}" target="_blank" style="color: black; text-decoration: underline;">${escapeHtml(url)}</a></b></li>`;
                          });
                          html += `</ul>`;
                      }
                      html += `<p><a href="detail.html?id=${key}" style="color: blue; text-decoration: underline;">Lihat Detail</a></p>`;
                      html += `</div><hr>`;
                  });
              } else {
                  html = '<p>Belum ada.. (:</p>';
              }
              allArchiveContainer.innerHTML = html;
              jumlahArchiveElement.textContent = `Total semua situs yang di retas hacker: ${jumlah}`;
              if (topAttacker) {
                  topAttackerElement.innerHTML = `Attacker Top <span>1</span>: <span style="font-size: 1.2em;">${topAttacker}</span>`;
              } else {
                  topAttackerElement.textContent = `Belum ada yang menjadi top 1`;
              }

          } catch (error) {
              console.error("Error:", error);
              allArchiveContainer.innerHTML = '<p>Gagal memuat archive.</p>';
          }
      }

      window.addEventListener('load', muatSemuaArchive);

      const tambahArchiveBtn = document.getElementById('tambahArchiveBtn');
      tambahArchiveBtn.addEventListener('click', simpanArchiveBaru);
      alert('ingatlah tidak seindah itu')
      alert('mohon di maklumi')
    </script>
