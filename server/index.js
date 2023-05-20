const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
//app.use(bodyParser.json());
app.use(express.json());

const path = require("path");
const filePath = path.join(__dirname, "uHealthyDatabase.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const parse = require("date-fns/parse");
const addDays = require("date-fns/addDays");
const format = require("date-fns/format");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    });
    app.listen(5000);
    console.log("Server is running at http://localhost:5000/");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const responseSender = (response, code, text) => {
  response.status(code);
  response.send(text);
};
app.get("/", (request, response) => {
  response.send("Hello World!");
});

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Token Does Not Exist");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid Access Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

//Login API
app.post("/user/", async (request, response) => {
  const { username, password } = request.body;
  const getUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbUser = await db.get(getUserQuery);
  if (dbUser === undefined) {
    responseSender(response, 400, "Invalid user");
    return;
  }
  const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
  if (!isPasswordMatched) {
    responseSender(response, 400, "Invalid password");
    return;
  } else {
    const payload = { username: username };
    const secretKey = "MY_SECRET_TOKEN";
    const jwtToken = jwt.sign(payload, secretKey);
    response.send({ jwt_token: jwtToken });
  }
});

//Add Medicine Reminder API
app.post(
  "/add-medicine-reminder/",
  authenticateToken,
  async (request, response) => {
    const {
      medicineName,
      medicineType,
      units,
      unitsType,
      intakeTimeList,
      startFrom,
      repeatDays,
      checked,
    } = request.body;
    for (let i = 0; i < repeatDays; i++) {
      for (let time of intakeTimeList) {
        const dateString = `${startFrom} ${time}`;
        const resultDate = addDays(new Date(dateString), i);
        const date = format(new Date(resultDate), "yyyy-MM-dd HH:mm");
        const now = new Date();
        if (resultDate > now) {
          const id = uuidv4();
          const addMedicineReminderQuery = `
          INSERT INTO
          medicine_reminder_${request.username}
          (id, medicine_name, medicine_type, units, units_type, intake_time, checked)
          VALUES (
            '${id}',
            '${medicineName}',
            '${medicineType}',
            '${units}',
            '${unitsType}',
            '${date}',
            ${checked}
          );
        `;
          await db.run(addMedicineReminderQuery);
        }
      }
    }
    responseSender(response, 200, "Medicine Reminder Added");
  }
);

//Get Reminders API
app.get("/reminders/", authenticateToken, async (request, response) => {
  const getMedicineRemindersQuery = `
    SELECT * FROM medicine_reminder_${request.username} 
    ORDER BY intake_time ASC
  `;
  const medicineReminders = await db.all(getMedicineRemindersQuery);

  const now = format(new Date(), "yyyy-MM-dd HH:mm");
  const add15Days = format(addDays(new Date(), 15), "yyyy-MM-dd HH:mm");
  const getAppointmentsQuery = `
    SELECT * FROM appointments_${request.username}
    ORDER BY date ASC
    LIMIT 4;
  `;
  const appointments = await db.all(getAppointmentsQuery);
  response.status(200);
  response.send({ medicineReminders, appointments });
});

//Update Appointment checked API
app.put(
  "/reminders/appointment/:id/",
  authenticateToken,
  async (request, response) => {
    const { checked } = request.body;
    const { id } = request.params;
    const updateAppointmentCheckedQuery = `
    UPDATE appointments_${request.username}
    SET checked = ${checked} WHERE id = '${id}';
  `;
    await db.run(updateAppointmentCheckedQuery);
    responseSender(response, 200, "OK");
  }
);

//Update Medicine Reminder checked API
app.put(
  "/reminders/medicine/:id/",
  authenticateToken,
  async (request, response) => {
    const { checked } = request.body;
    const { id } = request.params;
    const updateReminderCheckedQuery = `
    UPDATE medicine_reminder_${request.username}
    SET checked = ${checked} WHERE id = '${id}';
  `;
    await db.run(updateReminderCheckedQuery);
    responseSender(response, 200, "OK");
  }
);

//delete Appointment API
app.delete(
  "/reminders/appointment/:id/",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;
    const deleteAppointment = `
    DELETE FROM appointments_${request.username} WHERE id = '${id}';
  `;
    await db.run(deleteAppointment);
    responseSender(response, 200, "Reminder Deleted");
  }
);

//delete Medicine Reminder API
app.delete(
  "/reminders/medicine/:id/",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;
    const deleteMedicineReminder = `
    DELETE FROM medicine_reminder_${request.username} WHERE id = '${id}';
  `;
    await db.run(deleteMedicineReminder);
    responseSender(response, 200, "Reminder Deleted");
  }
);

//delete checked Appointments API
app.delete(
  "/reminders/appointments",
  authenticateToken,
  async (request, response) => {
    const deleteCheckedAppointments = `
  DELETE FROM appointments_${request.username} WHERE checked = TRUE;
  `;
    await db.run(deleteCheckedAppointments);
    responseSender(response, 200, "Reminders Deleted");
  }
);

//delete checked Medicine reminders API
app.delete(
  "/reminders/medicine",
  authenticateToken,
  async (request, response) => {
    const deleteCheckedMedicineReminders = `
  DELETE FROM medicine_reminder_${request.username} WHERE checked = TRUE;
  `;
    await db.run(deleteCheckedMedicineReminders);
    responseSender(response, 200, "Reminders Deleted");
  }
);
//add Glucose Level API
app.post(
  "/add-glucose-level/",
  authenticateToken,
  async (request, response) => {
    const { levelBeforeMeal, levelAfterMeal, checkupDate, checked } =
      request.body;
    const id = uuidv4();
    const addGlucoseLevelQuery = `
      INSERT INTO glucose_level_${request.username} (
        id, level_before_meal, level_after_meal, checkup_date, checked
      ) VALUES (
        '${id}',
        ${levelBeforeMeal},
        ${levelAfterMeal},
        '${checkupDate}',
        ${checked}
      );
    `;
    await db.run(addGlucoseLevelQuery);
    responseSender(response, 200, "Glucose Level Added");
  }
);
//Get Glucose Levels
app.get("/trackers/glucose", authenticateToken, async (request, response) => {
  const getGlucoseLevelsQuery = `
  SELECT * FROM glucose_level_${request.username}
  ORDER BY checkup_date DESC;
  `;
  const GlucoseLevels = await db.all(getGlucoseLevelsQuery);
  response.send(GlucoseLevels);
  response.status(200);
});
//Update Glucose Level checked API
app.put(
  "/trackers/glucose/:id/",
  authenticateToken,
  async (request, response) => {
    const { checked } = request.body;
    const { id } = request.params;
    const updateReminderCheckedQuery = `
    UPDATE glucose_level_${request.username}
    SET checked = ${checked} WHERE id = '${id}';
  `;
    await db.run(updateReminderCheckedQuery);
    responseSender(response, 200, "OK");
  }
);
//delete Glucose Level API
app.delete(
  "/trackers/glucose/:id/",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;
    const deleteMedicineReminder = `
    DELETE FROM glucose_level_${request.username} WHERE id = '${id}';
  `;
    await db.run(deleteMedicineReminder);
    responseSender(response, 200, "Levels Deleted");
  }
);
//delete checked Glucose Levels API
app.delete(
  "/trackers/glucose/",
  authenticateToken,
  async (request, response) => {
    const deleteCheckedMedicineReminders = `
  DELETE FROM glucose_level_${request.username} WHERE checked = TRUE;
  `;
    await db.run(deleteCheckedMedicineReminders);
    responseSender(response, 200, "Levels Deleted");
  }
);

//Add Appointment API
app.post("/add-appointment/", authenticateToken, async (request, response) => {
  const {
    appointmentWith,
    appointmentVenue,
    appointmentDate,
    appointmentTime,
    checked,
  } = request.body;
  const dateString = `${appointmentDate} ${appointmentTime}`;
  const date = format(new Date(dateString), "yyyy-MM-dd HH:mm");
  const id = uuidv4();
  const addAppointmentQuery = `
          INSERT INTO
          appointments_${request.username}
          (id, appointment_with, appointment_venue, date, checked)
          VALUES (
            '${id}',
            '${appointmentWith}',
            '${appointmentVenue}',
            '${date}',
            ${checked}
          );
        `;
  await db.run(addAppointmentQuery);
  responseSender(response, 200, "Medicine Reminder Added");
});
