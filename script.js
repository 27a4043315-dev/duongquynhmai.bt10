class SinhVien {
    constructor(hoTen, msv) {
        this.hoTen = hoTen;
        this.msv = msv;

        this.email = this.taoEmail();
        this.khoaHoc = this.tinhKhoaHoc();
        this.khoa = this.xacDinhKhoa();
    }

    taoEmail() {
        let cleanName = this.hoTen
            .replace(/\(.*?\)/g, "") // bỏ (LT)
            .trim()
            .toLowerCase();

        let parts = cleanName.split(" ");

        let ten = parts.pop();
        let chuCaiDau = parts.map(p => p[0]).join("");

        return `${ten}${chuCaiDau}.${this.msv.toLowerCase()}@hvnh.edu.vn`;
    }

    tinhKhoaHoc() {
        return "K" + this.msv.substring(0, 2);
    }

    xacDinhKhoa() {
        let kyTu = this.msv[2];

        switch (kyTu) {
            case "A": return "Công nghệ thông tin";
            case "B": return "Tài chính";
            case "C": return "Ngân hàng";
            case "D": return "Kế toán";
            default: return "Khác";
        }
    }
}

console.log("JS đã chạy");

document.getElementById("fileInput").addEventListener("change", function(e) {
    console.log("Đã chọn file");

    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        console.log("Dữ liệu:", json);

        let danhSach = [];

        // ⚠️ ĐỌC THEO VỊ TRÍ CỘT (fix 100%)
        json.forEach(row => {
            let values = Object.values(row);

            let msv = values[1];   // cột 2: Mã SV
            let hoTen = values[2]; // cột 3: Họ tên

            if (hoTen && msv) {
                danhSach.push(new SinhVien(hoTen, msv));
            }
        });

        hienThi(danhSach);
    };

    reader.readAsArrayBuffer(file);
});

function hienThi(danhSach) {
    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    danhSach.forEach(sv => {
        tbody.innerHTML += `
            <tr>
                <td>${sv.hoTen}</td>
                <td>${sv.msv}</td>
                <td>${sv.khoaHoc}</td>
                <td>${sv.khoa}</td>
                <td>${sv.email}</td>
            </tr>
        `;
    });
}
