import { LeaveTypes } from "@/types/index";

export const LEAVE_TYPES: LeaveTypes = {
  activity: {
    label: "Regular Activity",
    placeholder: `Describe your internship activity for the day
e.g.:
- Petting cat all day.
- Watching K-drama during a meeting.
  `,
  },
  holiday: {
    label: "Public Holiday",
    defaultText:
      "On leave due to the public holiday, [Specify Holiday Name, e.g., 'National Day']. \n\n[Add any additional notes or reasons if required]",
  },
  mc: {
    label: "Medical Certificate (MC)",
    defaultText:
      "On medical leave as per the attached Medical Certificate. \n\n[Specify reason if required, e.g., 'flu symptoms']",
  },
  annual: {
    label: "Annual Leave",
    defaultText:
      "On annual leave as approved by supervisor. \n\n[Optional: Add reasons if relevant]",
  },
  emergency: {
    label: "Emergency Leave",
    defaultText:
      "On emergency leave due to urgent personal matters. \n\n[Specify reason, e.g., 'family emergency']",
  },
};
