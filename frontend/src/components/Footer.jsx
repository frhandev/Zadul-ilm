export default function Footer() {
  return (
    <footer className="flex justify-center items-center bg-gray-100 mt-10 text-center text-gray-600 min-h-[20vh]">
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
