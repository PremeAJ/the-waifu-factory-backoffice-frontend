import * as yup from "yup";

export const categoryNameEn = yup .string() .max(50, "ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร") .matches(/^[a-zA-Z0-9\s]*$/, "ชื่อภาษาอังกฤษต้องใช้ตัวอักษรภาษาอังกฤษเท่านั้น")
export const categoryNameThRequired = yup .string() .required("กรุณากรอกชื่อหมวดหมู่ (ภาษาไทย)") .min(2, "ชื่อหมวดหมู่ต้องมีอย่างน้อย 2 ตัวอักษร") .max(50, "ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร")
export const confirmPasswordSchema = yup .string() .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน") .required("กรุณายืนยันรหัสผ่าน");
export const emailValidator = yup .string() .email("รูปแบบอีเมลไม่ถูกต้อง") .required("กรุณากรอกอีเมล");
export const emailValidatorNotRequired = yup .string() .nullable() .notRequired() .email("รูปแบบอีเมลไม่ถูกต้อง");
export const firstNameSchema = yup .string() .required("กรุณากรอกชื่อ") .matches(/^[ก-๙a-zA-Z\s]+$/, "ชื่อห้ามมีตัวเลขหรืออักขระพิเศษ");
export const firstNameSchemaNotRequired = yup .string() .nullable() .notRequired() .test( "is-valid-firstname", "ชื่อห้ามมีตัวเลขหรืออักขระพิเศษ", value => !value || /^[ก-๙a-zA-Z\s]+$/.test(value) );
export const lastNameSchema = yup .string() .required("กรุณากรอกนามสกุล") .matches(/^[ก-๙a-zA-Z\s]+$/, "นามสกุลห้ามมีตัวเลขหรืออักขระพิเศษ");
export const lastNameSchemaNotRequired = yup .string() .nullable() .notRequired() .test( "is-valid-lastname", "นามสกุลห้ามมีตัวเลขหรืออักขระพิเศษ", value => !value || /^[ก-๙a-zA-Z\s]+$/.test(value) );
export const nickNameSchema = yup .string() .required("กรุณากรอกชื่อเล่น") .matches(/^[ก-๙a-zA-Z\s]+$/, "ชื่อเล่นห้ามมีตัวเลขหรืออักขระพิเศษ");
export const nickNameSchemaNotRequired = yup .string() .nullable() .notRequired() .test( "is-valid-nickname", "ชื่อเล่นห้ามมีตัวเลขหรืออักขระพิเศษ", value => !value || /^[ก-๙a-zA-Z\s]+$/.test(value) );
export const passwordRequired = yup .string() .required("กรุณากรอก รหัสผ่าน")
export const passwordSchema = yup .string() .required("กรุณากรอกรหัสผ่าน") .test("password-rules", "", function (value) { const errors = []; if (!value) return this.createError({ message: "กรุณากรอกรหัสผ่าน" }); if (value.length < 6) errors.push("ต้องมีความยาวอย่างน้อย 6 ตัวอักษร"); if (!/[a-z]/.test(value)) errors.push("ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว"); if (!/[A-Z]/.test(value)) errors.push("ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว"); if (!/\d/.test(value)) errors.push("ต้องมีตัวเลขอย่างน้อย 1 ตัว"); if (!/[^a-zA-Z0-9]/.test(value)) errors.push("ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว"); return errors.length > 0 ? this.createError({ message: errors.join("\n") }) : true; });
export const phoneSchema = yup .string() .required("กรุณากรอกเบอร์โทรศัพท์") .matches(/^0[0-9]{8,9}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 0812345678)");
export const phoneSchemaNotRequired = yup .string() .nullable() .notRequired() .test( "is-valid-phone", "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 0812345678)", value => !value || /^0[0-9]{8,9}$/.test(value) );
export const requiredPasswordSchema = yup .string() .required("กรุณากรอกรหัสผ่าน");
export const statusRequired = yup.boolean().required("กรุณาเลือกสถานะ")
export const stringOptional = yup.string().optional()
