export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4 mt-10 text-center text-gray-600">
      © {new Date().getFullYear()} جميع الحقوق محفوظة لـ زاد العلم | تصميم
      وتطوير{" "}
      <a
        className="text-primary font-bold"
        href="https://kodnasoft.com/"
        target="blank"
      >
        كودنا سوفت
      </a>
    </footer>
  );
}
