# Deploy Văn Miếu · Quốc Tử Giám bằng GitHub Pages

## 1. Tạo repository

Tạo một repository trên GitHub, ví dụ `van-mieu-quoc-tu-giam`. Repository nên để public nếu dùng GitHub Pages miễn phí.

## 2. Đẩy mã nguồn lên GitHub

```bash
git init
git add .
git commit -m "Build Van Mieu Quoc Tu Giam website"
git branch -M main
git remote add origin https://github.com/<TEN_GITHUB>/<TEN_REPOSITORY>.git
git push -u origin main
```

Nếu dự án đã có Git remote, chỉ cần chạy:

```bash
git add .
git commit -m "Deploy website to GitHub Pages"
git push
```

## 3. Bật Pages bằng GitHub Actions

Vào **Settings → Pages** của repository, chọn **Source: GitHub Actions**. File `.github/workflows/deploy-pages.yml` sẽ tự chạy khi bạn push lên nhánh `main` hoặc khi bấm **Run workflow** trong tab **Actions**.

Workflow sẽ cài pnpm, chạy kiểm tra TypeScript, build thư mục `dist/public` và deploy thư mục đó lên GitHub Pages. Workflow cũng tự chép các ảnh trong `github-assets/` vào bản build; đây là bước cần thiết vì đường dẫn `/manus-storage/` chỉ hoạt động trong preview của Manus, không tồn tại trên GitHub Pages.

## 4. Địa chỉ website

Nếu repository tên `van-mieu-quoc-tu-giam`, địa chỉ sẽ là:

```text
https://<TEN_GITHUB>.github.io/van-mieu-quoc-tu-giam/
```

Vite đã được cấu hình tự động nhận tên repository từ biến `GITHUB_REPOSITORY`, vì vậy không cần sửa thủ công `base` trong mỗi lần deploy.

## 5. API DeepSeek

GitHub Pages chỉ phục vụ frontend tĩnh. API DeepSeek trên Railway vẫn chạy riêng và website gọi đến endpoint API đã cấu hình trong mã nguồn. Không đưa token bí mật vào GitHub; nên lưu token trong biến môi trường của dịch vụ Railway và để frontend gọi qua một backend/proxy an toàn.

Nếu endpoint Railway không cho phép CORS từ GitHub Pages, cần bật CORS cho domain:

```text
https://<TEN_GITHUB>.github.io
```

## 6. Nếu gặp lỗi “site does not contain the requested file”

Kiểm tra ba điểm sau:

1. Repository phải chứa thư mục `.github/workflows/deploy-pages.yml` và thư mục `github-assets/`.
2. Trong **Settings → Pages**, mục **Source** phải là **GitHub Actions**, không phải **Deploy from a branch**.
3. Vào tab **Actions**, workflow `Deploy website to GitHub Pages` phải hoàn thành màu xanh. Chỉ mở URL sau khi job **deploy** hoàn tất.

Nếu repository có chữ hoa hoặc dấu gạch dưới, URL phải dùng đúng tên repository, ví dụ:

```text
https://<TEN_GITHUB>.github.io/Van_Mieu_Quoc_Tu_Giam/
```

## 7. Dùng trực tiếp `index.html` ở root

Dự án đã có sẵn bản build tĩnh ở root gồm `index.html`, thư mục `assets/` và `.nojekyll`. Nếu muốn dùng kiểu deploy branch thay vì GitHub Actions, vào **Settings → Pages**, chọn **Deploy from a branch**, chọn nhánh `main` và thư mục `/ (root)`, sau đó bấm **Save**.

Khi đó URL vẫn là:

```text
https://<TEN_GITHUB>.github.io/Van_Mieu_Quoc_Tu_Giam/
```

Không mở `/client/index.html`; thư mục `client/` là source code, còn `index.html` ở root mới là file trang chính.

## 8. Cập nhật website

Mỗi lần sửa code, chạy:

```bash
git add .
git commit -m "Update website"
git push
```

GitHub Actions sẽ tự build và cập nhật website.
