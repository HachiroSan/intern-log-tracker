export const TEMPLATE_SETTINGS = {
  basic: {
    label: "Basic",
    description: "Basic template for general use",
    requiredFields: {
      student_id: { label: "Student ID", placeholder: "Enter student ID" },
      student_name: {
        label: "Student Name",
        placeholder: "Enter student name",
      },
      industry_name: {
        label: "Industry Name",
        placeholder: "Enter industry name",
      },
    },
    url: "https://raw.githubusercontent.com/HachiroSan/log_track_template/refs/heads/main/TEMPLATE_BASIC.docx",
  },
  "umpsa-psm-2023": {
    label: "UMPSA-PSM-2023",
    description: "Template for UMPSA PSM 2023",
    requiredFields: {
      student_id: { label: "Student ID", placeholder: "Enter student ID" },
      student_name: {
        label: "Student Name",
        placeholder: "Enter student name",
      },
      industry_name: {
        label: "Industry Name",
        placeholder: "Enter industry name",
      },
      industry_coach_name: {
        label: "Industry Coach Name",
        placeholder: "Enter coach name",
      },
      academic_tutor_name: {
        label: "Academic Tutor Name",
        placeholder: "Enter tutor name",
      },
    },
    url: "https://raw.githubusercontent.com/HachiroSan/log_track_template/refs/heads/main/TEMPLATE_PSM_2024.docx",
  },
};
