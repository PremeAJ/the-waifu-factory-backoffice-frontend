import * as yup from "yup";

export const emailValidator = yup
  .string()
  .email("รูปแบบอีเมลไม่ถูกต้อง")
  .required("กรุณากรอกอีเมล");
export const passwordValidator = yup
  .string()
  .required("กรุณากรอกรหัสผ่าน")
  .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    "รหัสผ่านต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ ตัวเลข และอักษรพิเศษ"
  );
