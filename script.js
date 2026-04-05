console.log("JS OK");

class SinhVien {
    constructor(hoTen, msv) {
        this.hoTen = hoTen;
        this.msv = msv;

        this.email = this.taoEmail();
        this.khoaHoc = this.tinhKhoaHoc();
        this.khoa = this.xacDinhKhoa();
    }

    taoEmail() {
        let clean = this.hoTen
            .replace(/\(.*?\)/g, "")
            .trim()
            .toLowerCase();

        let parts = clean.split(" ");
        let ten = parts.pop();
        let initials = parts.map(p => p[0]).join("");

        return `${ten}${initials}.${this.msv.toLowerCase()}@hvnh.edu.vn`;
    }

    tinhKhoaHoc() {
        return "K" + this.msv.substring(0, 2);
    }

    xacDinhKhoa() {
        if (!this.msv || this.msv.length < 6) return "Không xác định";

        let code = this.msv.substring(3, 6);

        switch (code) {
            case "404": return "CNTT & KTS";
            case "408": return "Khoa học dữ liệu";
            case "401": return "Tài chính - Ngân hàng";
            case "403": return "Quản trị kinh doanh";
            case "405": return "Kinh doanh quốc tế";
            case "407": return "Kinh tế";
            case "406": return "Luật";
            case "751": return "Ngoại ngữ";
            case "402": return "Kế toán - Kiểm toán";
            default: return "Không xác định";
        }
    }
}

// EVENT LOAD FILE
document.getElementById("fileInput").addEventListener("change", function(e) {
    console.log("Đã chọn file");

    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();

    reader.onload = function(event) {
        try {
            let data = new Uint8Array(event.target.result);
            let workbook = XLSX.read(data, { type: "array" });

            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let json = XLSX.utils.sheet_to_json(sheet);

            console.log("DATA:", json);

            let danhSach = [];

            json.forEach(row => {
                let values = Object.values(row);

                let msv = values[1];
                let hoTen = values[2];

                if (msv && hoTen) {
                    danhSach.push(new SinhVien(hoTen, msv));
                }
            });

            hienThi(danhSach);

        } catch (err) {
            console.error("Lỗi:", err);
            alert("Lỗi đọc file Excel!");
        }
    };

    reader.readAsArrayBuffer(file);
});

// HIỂN THỊ
function hienThi(ds) {
    let tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    ds.forEach(sv => {
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
