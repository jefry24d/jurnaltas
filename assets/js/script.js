async function submitForm(event) {
    event.preventDefault();

    // Ambil nilai dari editor dan masukkan ke input hidden
    const editorContent = document.getElementById("editor").innerHTML;
    document.getElementById("kegiatan").value = editorContent;

    const nama = document.getElementById("nama").value;
    const tanggal = document.getElementById("tanggal").value;
    const kegiatan = document.getElementById("kegiatan").value;

    // Ambil hari dari tanggal
    const hari = new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long" });

    // Ambil waktu submit
    const waktu = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        // Kirim data ke API
        const response = await fetch("https://sheetdb.io/api/v1/hn31rrz6kcxez", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [{ nama, hari, tanggal, waktu, kegiatan }] }), // Menambahkan waktu
        });

        if (response.ok) {
            alert("Data berhasil disimpan ke Spreadsheet!");

            // Setelah data berhasil disubmit, tambahkan data ke tabel
            const tableBody = document.getElementById('table-body');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nama}</td>
                <td>${hari}</td>
                <td>${tanggal}</td>
                <td>${waktu}</td>
                <td>${kegiatan}</td>
            `;
            tableBody.appendChild(row);

            // Reset form setelah submit
            document.getElementById("kegiatan-form").reset();
            localStorage.removeItem("draft"); // Hapus draft setelah submit
        } else {
            alert("Terjadi kesalahan saat menyimpan data ke Spreadsheet.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Tidak dapat menyimpan data. Periksa koneksi internet Anda.");
    }
}

// Fungsi untuk menyimpan data sementara di localStorage
function saveDraft() {
    const editorContent = document.getElementById("editor").innerHTML;
    document.getElementById("kegiatan").value = editorContent;

    const nama = document.getElementById("nama").value;
    const tanggal = document.getElementById("tanggal").value;
    const kegiatan = document.getElementById("kegiatan").value;

    const hari = new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long" });

    const draft = { nama, hari, tanggal, kegiatan };
    localStorage.setItem("draft", JSON.stringify(draft));
    alert("Data disimpan sementara!");
}

// Fungsi untuk mengisi form dengan draft jika ada
function loadDraft() {
    const draft = localStorage.getItem("draft");
    if (draft) {
        const parsedDraft = JSON.parse(draft);
        document.getElementById("nama").value = parsedDraft.nama;
        document.getElementById("tanggal").value = parsedDraft.tanggal;
        document.getElementById("editor").innerHTML = parsedDraft.kegiatan; // Muat ke editor
    } else {
        const today = new Date();
        document.getElementById("tanggal").value = today.toISOString().split("T")[0];
        document.getElementById("hari").innerText = today.toLocaleDateString("id-ID", { weekday: "long" });
    }
}

// Panggil fungsi loadDraft saat halaman dimuat
window.onload = loadDraft;
