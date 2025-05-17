import * as yup from "yup";

export const emailValidator = yup
  .string()
  .email("รูปแบบอีเมลไม่ถูกต้อง")
  .required("กรุณากรอกอีเมล");
export const passwordSchema = yup
  .string()
  .required("Password is required")
  .test("password-rules", "", function (value) {
    const errors = [];

    if (!value) return this.createError({ message: "กรุณากรอกรหัสผ่าน" });

    if (value.length < 6) {
      errors.push("ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว");
    }
    if (!/\d/.test(value)) {
      errors.push("ต้องมีตัวเลขอย่างน้อย 1 ตัว");
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.push("ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
    }

    return errors.length > 0
      ? this.createError({ message: errors.join("\n") })
      : true;
  });

  