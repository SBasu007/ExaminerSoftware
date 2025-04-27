import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "CTSS",
  password: "Shomi$2004",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs",{message:"Welcome"})
  });

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];  

//School
app.get("/addSchool",(req,res) => {
  res.render("school/add_school.ejs")
});
app.post("/addSchool", async (req,res)=>{
  let scode = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let principal = req.body.principal;
  let zone = req.body.zone;
  let comm = req.body.commission;
  try {
    await db.query(
      "INSERT INTO school (code, name, phone, address, principal, zone, commission) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [scode, name, phone, address, principal, zone, comm]
    );
    res.render("school/add_school.ejs");
  } catch (error) {
    console.error('Error inserting into school table:', error);
    res.render("index,ejs",{message:"Error adding school to database"})
  }
});
app.get("/viewSchool",(req,res) => {
  res.render("school/view_school.ejs")
});
app.post("/viewSchoolByCode", async (req,res)=>{
  let code = req.body.code;
  try{
  let result = await db.query("SELECT * FROM school WHERE code = $1",[code]);
  let fresult = result.rows[0];
  res.render("school/schoolByCode.ejs",{bool : false, code:fresult.code, name: fresult.name, phone: fresult.phone, address: fresult.address, principal: fresult.principal, zone: fresult.zone, commission: fresult.commission });
  }
  catch(err){
   console.log("not found")
   res.render("school/schoolByCode.ejs",{bool : true});
  }
});
app.post("/viewSchoolByZone", async (req,res) =>{
  let zone = req.body.zone;
  try{
    let result = await db.query("SELECT * FROM school WHERE zone = $1",[zone]);
    res.render("school/schoolByZone.ejs",{bool:false, display : result.rows,zone: zone});
  } catch(err){
    console.log("not found")
    res.render("school/schoolByZone.ejs",{bool : true});
  }
})
app.post("/editSchoolInitiate", async (req,res)=>{
  let scode = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let principal = req.body.principal;
  let zone = req.body.zone;
  let comm = req.body.commission;
  res.render("school/edit_School.ejs",{code: scode, name: name, phone: phone, address: address,principal: principal,zone: zone,commission:comm})
})
app.post("/editSchool", async (req, res) => {
  let o_code = req.body.ocode;
  let n_code = req.body.ncode;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let principal = req.body.principal;
  let zone = req.body.zone;
  let commission = req.body.commission;

  let field = [];
  let values = [];
  let paramCount = 1;

  if (n_code) {
      field.push(`code = $${paramCount}`);
      values.push(n_code);
      paramCount++;
  }
  if (name) {
      field.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
  }
  if (phone) {
      field.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
  }
  if (address) {
      field.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
  }
  if (principal) {
      field.push(`principal = $${paramCount}`);
      values.push(principal);
      paramCount++;
  }
  if (zone) {
      field.push(`zone = $${paramCount}`);
      values.push(zone);
      paramCount++;
  }
  if (commission) {
    field.push(`commission = $${paramCount}`);
    values.push(commission);
    paramCount++;
}

  values.push(o_code); // Add the original code as the last parameter

  if (field.length === 0) {
      console.log("No change");
      res.render("school/view_school.ejs");
      return; // Exit early if no fields to update
  }

  // Construct the SQL query dynamically
  let setClause = field.join(', ');
  let queryText = `UPDATE school SET ${setClause} WHERE code = $${paramCount}`;

  try {
      await db.query(queryText, values);
      res.render("school/view_school.ejs");
  } catch (err) {
      console.error("Error updating school:", err);
      // Handle error appropriately, possibly show an error page
      res.status(500).send("Error updating school");
  }
});
app.post("/deleteSchool", async (req,res)=>{
  let code = req.body.code;
  await db.query("DELETE FROM school WHERE school.code = $1",[code])
  res.render("index.ejs",{message:"School Deleted Successfully"})
})

//Agent
app.get("/addAgent",(req,res) => {
  res.render("agent/add_agent.ejs")
});
app.post("/addAgent", async (req,res)=>{
  let acode = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  try{
    await db.query("INSERT INTO agent (code, name, contact) VALUES ($1,$2,$3)",[acode, name, phone]);
res.render("agent/add_agent.ejs")
  }catch(error){
    console.error('Error inserting into agent table:', error);
    res.render("index,ejs",{message:"Error adding agent to database"})
  }
  
});
app.get("/viewAgent",(req,res) => {
  res.render("agent/view_agent.ejs")
});
app.post("/viewAgentByCode", async (req,res)=>{
  let code = req.body.code;
  try{
  let result = await db.query("SELECT * FROM agent WHERE code = $1",[code]);
  let fresult = result.rows[0];
  res.render("agent/agentByCode.ejs",{bool : false, code:fresult.code, name: fresult.name, phone: fresult.contact});
  }
  catch(err){
   console.log("not found")
   res.render("agent/agentByCode.ejs",{bool : true});
  }
});
app.post("/editAgentInitiate", async (req,res)=>{
  let acode = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  res.render("agent/edit_agent.ejs",{code: acode, name: name, phone: phone})
})  
app.post("/editAgent", async (req, res) => {
  let o_code = req.body.ocode;
  let n_code = req.body.ncode;
  let name = req.body.name;
  let phone = req.body.phone;

  let field = [];
  let values = [];
  let paramCount = 1;

  if (n_code) {
      field.push(`code = $${paramCount}`);
      values.push(n_code);
      paramCount++;
  }
  if (name) {
      field.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
  }
  if (phone) {
      field.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
  }
  values.push(o_code); // Add the original code as the last parameter

  if (field.length === 0) {
      console.log("No change");
      res.render("index.ejs",{message:"No changes added"});
      return; // Exit early if no fields to update
  }

  // Construct the SQL query dynamically
  let setClause = field.join(', ');
  let queryText = `UPDATE agent SET ${setClause} WHERE code = $${paramCount}`;

  try {
      await db.query(queryText, values);
      res.render("agent/view_agent.ejs");
  } catch (err) {
      console.error("Error updating school:", err);
      // Handle error appropriately, possibly show an error page
      res.render("index.ejs",{message:"Error in editing agent details"});
  }
});
app.post("/deleteAgent", async (req,res)=>{
  let code = req.body.code;
  try{
    await db.query("DELETE FROM agent WHERE agent.code = $1",[code])
    res.render("index.ejs",{message:"Agent Deleted Successfully"})
  }catch(error){
    res.render("index.ejs",{message:"Agent could not be deleted"})
  }
})

//Examiner
app.get("/addExaminer",(req,res) => {
  res.render("examiner/add_examiner.ejs")
});
app.post("/addExaminer", async (req,res)=>{
  let e_code = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let zone = req.body.zone;
  await db.query("INSERT INTO examiner (code, name, phone, address, zone) VALUES ($1,$2,$3,$4,$5)",[e_code, name, phone, address, zone]);
res.render("examiner/add_examiner.ejs")
});
app.get("/viewExaminer",(req,res) => {
  res.render("examiner/view_examiner.ejs")
});
app.post("/viewExaminerByCode", async (req,res)=>{
  let code = req.body.code;
  try{
  let result = await db.query("SELECT * FROM examiner WHERE code = $1",[code]);
  let fresult = result.rows[0];
  res.render("examiner/examinerByCode.ejs",{bool : false, code:fresult.code, name: fresult.name, phone: fresult.phone, address: fresult.address, zone: fresult.zone });
  }
  catch(err){
   console.log("not found")
   res.render("examiner/examinerByCode.ejs",{bool : true});
  }
});
app.post("/viewExaminerByZone", async (req,res) =>{
  let zone = req.body.zone;
  try{
    let result = await db.query("SELECT * FROM examiner WHERE zone = $1",[zone]);
    res.render("examiner/examinerByZone.ejs",{bool:false, display : result.rows, zone :zone});
  } catch(err){
    console.log("not found")
    res.render("examiner/examinerByZone.ejs",{bool : true});
  }
})
app.post("/editExaminerInitiate", async (req,res)=>{
  let ecode = req.body.code;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let zone = req.body.zone;
  res.render("examiner/edit_examiner.ejs",{code: ecode, name: name, phone: phone, address: address, zone: zone})
})
app.post("/editExaminer", async (req, res) => {
  let o_code = req.body.ocode;
  let n_code = req.body.ncode;
  let name = req.body.name;
  let phone = req.body.phone;
  let address = req.body.address;
  let zone = req.body.zone;

  let field = [];
  let values = [];
  let paramCount = 1;

  if (n_code) {
      field.push(`code = $${paramCount}`);
      values.push(n_code);
      paramCount++;
  }
  if (name) {
      field.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
  }
  if (phone) {
      field.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
  }
  if (address) {
      field.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
  }
  if (zone) {
      field.push(`zone = $${paramCount}`);
      values.push(zone);
      paramCount++;
  }

  values.push(o_code); // Add the original code as the last parameter

  if (field.length === 0) {
      console.log("No change");
      res.render("examiner/view_examiner.ejs");
      return; // Exit early if no fields to update
  }

  // Construct the SQL query dynamically
  let setClause = field.join(', ');
  let queryText = `UPDATE examiner SET ${setClause} WHERE code = $${paramCount}`;

  try {
      await db.query(queryText, values);
      res.render("examiner/view_examiner.ejs");
  } catch (err) {
      console.error("Error updating school:", err);
      // Handle error appropriately, possibly show an error page
      res.status(500).send("Error updating school");
  }
});
app.post("/deleteExaminer", async (req,res)=>{
  let code = req.body.code;
  await db.query("DELETE FROM examiner WHERE examiner.code = $1",[code])
  res.render("index.ejs",{message:"Examiner Deleted Successfully"})
})


//Exam
app.post("/createExamPage", (req, res) => {
  let school_code = req.body.code;
  res.render("create_exam.ejs",{code : school_code})
});
app.post("/createExam", async (req,res)=>{
  try{
    let scode = req.body.school_code;
    let session = req.body.session;
    let month = req.body.month;
    let date = req.body.date;
    let acode = req.body.agent_code;
    let forms = req.body.forms;
    let collection = req.body.collection;
    
    let result = await db.query("INSERT INTO exam (month, session, examiner_assigned, examiner_code, direct_candidate, food, transport,fees, school_code,conducted, date,examiner_paid,direct_candidate_fees,agent_code,forms,collection) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id",[month, session, false, null, 0,0,0,0,scode,false,date,false,0,acode,forms,collection]);
    let exam_id = result.rows[0].id;
    let school_result = await db.query("SELECT school.commission FROM school WHERE school.code = $1",[scode]);
    let commission_p = school_result.rows[0].commission;
    let commission_amt = collection*(commission_p/100);
    const d = new Date();
    let currentMonth = months[d.getMonth()];
    let currentYear = d.getFullYear();
    let currentDay = d.getDate();
    let currentDate = currentDay+'.'+(d.getMonth()+1)+'.'+currentYear;
    await db.query("INSERT INTO school_fees (agent_code,exam_id,school_code,date,month,agent_commission,agent_paid,month_no) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",[acode,exam_id,scode,currentDate,currentMonth,commission_amt,false,d.getMonth()]);
    res.render("index.ejs",{message:"Exam created successfully"})
  }catch(error)
  {
    res.render("index.ejs",{message:"Error creating exam"})
  }
});
app.post("/viewExamBySchoolCode", async (req,res)=>{
  let s_code = req.body.code;
  try{
    let result = await db.query("SELECT exam.id, exam.session, exam.month, exam.date, examiner.name, examiner.phone, exam.examiner_assigned, exam.conducted,school.name AS schooln FROM exam LEFT JOIN examiner ON examiner.code = exam.examiner_code JOIN school ON exam.school_code = school.code WHERE exam.school_code = $1 ORDER BY exam.conducted ASC, exam.session DESC",[s_code]);
    res.render("view_school_exams.ejs",{bool:false, display : result.rows});
  } catch(err){
    console.log("not found")
    res.render("school/schoolByZone.ejs",{bool : true});
  }
})
app.post("/viewExamDetails", async (req, res) => {
  let route = req.body.route;
  let exam_code = req.body.code;
  let exam_result = await db.query("SELECT * FROM exam WHERE id = $1",[exam_code]);
  let school_result = await db.query("SELECT school.name,school.address,school.code FROM school JOIN exam ON exam.school_code = school.code WHERE exam.id = $1",[exam_code]);
  let examiner_result =  await db.query("SELECT examiner.name,examiner.phone,examiner.code FROM examiner JOIN exam ON exam.examiner_code = examiner.code WHERE exam.id = $1",[exam_code]);
  res.render("view_exam_details.ejs",{bool:false, exam : exam_result.rows, school : school_result.rows, examiner : examiner_result.rows,route:route})
});
app.post("/findExaminer", async (req, res) =>{
let exam_id = req.body.examid;
let school_code = req.body.schoolcode;
let zone = await db.query("SELECT zone from school WHERE code = $1",[school_code]);
let examiners = await db.query("SELECT * FROM examiner ORDER BY CASE WHEN zone = $1 THEN 1 ELSE 2 END, zone;",[zone.rows[0].zone])
res.render("appoint_examiner.ejs",{display: examiners.rows, bool:false, examid : exam_id})
})
app.post("/selectExaminer", async (req, res) =>{
  let exam_id = req.body.examid;
  let examiner_code = req.body.examinercode;
  await db.query("UPDATE exam SET examiner_assigned = true, examiner_code = $1 WHERE id = $2",[examiner_code,exam_id]);
  let exam_result = await db.query("SELECT * FROM exam WHERE id = $1",[exam_id]);
  let school_result = await db.query("SELECT school.name,school.address,school.code FROM school JOIN exam ON exam.school_code = school.code WHERE exam.id = $1",[exam_id]);
  let examiner_result =  await db.query("SELECT examiner.name,examiner.phone FROM examiner JOIN exam ON exam.examiner_code = examiner.code WHERE exam.id = $1",[exam_id]);
  res.render("view_exam_details.ejs",{bool:false, exam : exam_result.rows, school : school_result.rows, examiner : examiner_result.rows,route:1})
  })
app.post("/viewExamByExaminerCode", async (req,res)=>{
    let e_code = req.body.code;
    try{
      let result = await db.query("SELECT exam.id, exam.session, exam.month, exam.date, exam.conducted,exam.examiner_paid, school.name, school.address, school.phone,examiner.name AS exam_taker FROM exam JOIN examiner ON examiner.code = exam.examiner_code JOIN school ON exam.school_code = school.code WHERE exam.examiner_code = $1 ORDER BY exam.conducted ASC",[e_code]);
      if (result.rows.length===0){
        res.render("index.ejs",{message:"Examiner has no exams assigned"})
      }else{
        res.render("view_examiner_exams.ejs",{bool:false, display : result.rows});
      }
    } catch(err){
      console.log("not found")
      res.render("view_examiner_exams.ejs",{bool : true});
    }
})
app.post("/editExamInitiate", async (req,res)=>{
  let examid = req.body.examid;
  let session = req.body.session;
  let month = req.body.month;
  let date = req.body.date;
  let examiner_name = req.body.examiner_name;
  let examiner_contact = req.body.examiner_call;
  let result = await db.query("SELECT school.zone FROM exam JOIN school ON school.code = exam.school_code WHERE exam.id = $1",[examid])
  res.render("edit_exam.ejs",{examid:examid, session: session, month: month, date: date, examiner_name: examiner_name, examiner_contact:examiner_contact, zone:result.rows[0].zone, fees: req.body.fees, food: req.body.food, travel: req.body.travel, direct_candidate: req.body.direct_candidate, direct_candidate_fees: req.body.direct_candidate_fees,agent_code:req.body.agent_code, forms:req.body.forms,collection:req.body.collection})
})
app.post("/editExam",async (req, res) => {
  let examid = req.body.examid;
  let session = req.body.session;
  let month = req.body.month;
  let date = req.body.date;
  let fees = req.body.fees;
  let food = req.body.food;
  let travel = req.body.travel;
  let direct_candidate = req.body.direct_candidate;
  let direct_candidate_fees = req.body.direct_candidate_fees;
  let agent_code=req.body.agent_code;
  let forms=req.body.forms;
  let collection=req.body.collection;


  let field = [];
  let values = [];
  let paramCount = 1;

  if (session) {
      field.push(`session = $${paramCount}`);
      values.push(session);
      paramCount++;
  }
  if (month) {
      field.push(`month = $${paramCount}`);
      values.push(month);
      paramCount++;
  }
  if (date) {
      field.push(`date = $${paramCount}`);
      values.push(date);
      paramCount++;
  }
  if (fees) {
    field.push(`fees = $${paramCount}`);
    values.push(fees);
    paramCount++;
  }
  if (food) {
    field.push(`food = $${paramCount}`);
    values.push(food);
    paramCount++;
  }
  if (travel) {
    field.push(`transport = $${paramCount}`);
    values.push(travel);
    paramCount++;
  }
  if (direct_candidate) {
    field.push(`direct_candidate = $${paramCount}`);
    values.push(direct_candidate);
    paramCount++;
  }
  if (direct_candidate_fees) {
    field.push(`direct_candidate_fees = $${paramCount}`);
    values.push(direct_candidate_fees);
    paramCount++;
  }
  if (agent_code) {
    field.push(`agent_code = $${paramCount}`);
    values.push(agent_code);
    paramCount++;
  }
  if (forms) {
    field.push(`forms = $${paramCount}`);
    values.push(forms);
    paramCount++;
  }
  if (collection) {
    field.push(`collection = $${paramCount}`);
    values.push(collection);
    paramCount++;
  }

  values.push(examid); // Add the original code as the last parameter

  if (field.length === 0) {
      console.log("No change");
      res.render("index.ejs",{message:"No changes added"});
      return; // Exit early if no fields to update
  }

  // Construct the SQL query dynamically
  let setClause = field.join(', ');
  let queryText = `UPDATE exam SET ${setClause} WHERE id = $${paramCount}`;

  try {
      await db.query(queryText, values);
      res.render("index.ejs",{message: "Edited Successfully"});
  } catch (err) {
      console.error("Error updating school:", err);
      // Handle error appropriately, possibly show an error page
      res.status(500).send("Error updating school");
  }
});
app.post("/initiateExaminerChange", async (req, res) =>{
  let exam_id = req.body.examid;
  let zone = req.body.zone;
  await db.query("UPDATE exam SET examiner_assigned = false,examiner_code = null WHERE id = $1",[exam_id])
  let examiners = await db.query("SELECT * FROM examiner ORDER BY CASE WHEN zone = $1 THEN 1 ELSE 2 END, zone;",[zone])
  res.render("appoint_examiner.ejs",{display: examiners.rows, bool:false, examid : exam_id})
  })
app.post("/changeExamStatus", async(req,res)=>{
  let s_code = req.body.schoolcode;
  let route = req.body.route;
  let exam_id = req.body.examid;
  let status = req.body.status;
  let examiner_code = req.body.examiner_code;
  let newStatus = status === 'true';
  await db.query("UPDATE exam SET conducted = $1 WHERE id = $2",[!newStatus, exam_id])
  if(route === "2"){
    let result = await db.query("SELECT exam.id, exam.session, exam.month, exam.date,exam.examiner_paid, exam.conducted, school.name, school.address, school.phone FROM exam JOIN examiner ON examiner.code = exam.examiner_code JOIN school ON exam.school_code = school.code WHERE exam.examiner_code = $1 ORDER BY exam.conducted ASC",[examiner_code]);
    res.render("view_examiner_exams.ejs",{bool:false, display : result.rows});
  }else{
    let output = await db.query("SELECT exam.id, exam.session, exam.month, exam.date, examiner.name, examiner.phone, exam.examiner_assigned, exam.conducted,school.name AS schooln FROM exam LEFT JOIN examiner ON examiner.code = exam.examiner_code JOIN school ON exam.school_code = school.code WHERE exam.school_code = $1 ORDER BY exam.conducted ASC, exam.session DESC",[s_code]);
  res.render("view_school_exams.ejs",{bool:false, display : output.rows});
  }
})
app.get("/pendingExams", async(req,res)=>{
let result = await db.query("SELECT school.name AS s_name,school.phone AS s_contact,school.address,exam.*,examiner.name,examiner.phone FROM exam LEFT JOIN examiner ON exam.examiner_code = examiner.code JOIN school ON exam.school_code = school.code WHERE exam.conducted = false")
res.render("all_exams.ejs",{bool:false,message:"pending ",display:result.rows})
})
app.get("/completedExams", async(req,res)=>{
  let result = await db.query("SELECT school.name AS s_name,school.phone AS s_contact,school.address,exam.*,examiner.name,examiner.phone FROM exam LEFT JOIN examiner ON exam.examiner_code = examiner.code JOIN school ON exam.school_code = school.code WHERE exam.conducted = true")
  res.render("all_exams.ejs",{bool:false,message:"completed ",display:result.rows})
  })
app.get("/allExams", async(req,res)=>{
    let result = await db.query("SELECT school.name AS s_name,school.phone AS s_contact,school.address,exam.*,examiner.name,examiner.phone FROM exam LEFT JOIN examiner ON exam.examiner_code = examiner.code JOIN school ON exam.school_code = school.code")
    res.render("all_exams.ejs",{bool:false,message:"",display:result.rows})
    }) 
app.post("/deleteExam", async (req,res)=>{
      let examid = req.body.examid;
      await db.query("DELETE FROM exam WHERE exam.id = $1",[examid])
      res.render("index.ejs",{message:"Exam Deleted Successfully"})
    })    

//Report
app.get("/examinerReportInitiate",async (req,res)=>{
  res.render("report/examiner_report_enter.ejs")
})
app.get("/agentReportInitiate",async (req,res)=>{
  res.render("report/agent_report_enter.ejs")
})
app.post("/examinerReportByCode",async (req,res)=>{
  let examiner_code = req.body.code
  let result = await db.query("SELECT school.name, school.address, exam.*, examiner.name AS exam_taker FROM exam JOIN school ON school.code = exam.school_code JOIN examiner ON exam.examiner_code = examiner.code WHERE exam.examiner_code = $1 AND exam.conducted = true ORDER BY exam.examiner_paid ASC;",[examiner_code])
  if (result.rows.length === 0){
    res.render("report/examinerReportByCode.ejs",{bool:true})
  }else{
    res.render("report/examinerReportByCode.ejs",{display:result.rows,bool:false})
  }
})
app.post("/agentReportByCode",async (req,res)=>{
  let agent_code = req.body.code
  let result = await db.query("SELECT agent.name AS agentname,agent.contact, school.name AS schoolname, school.zone, exam.session, exam.forms, exam.collection, school_fees.date, school_fees.month, school_fees.agent_commission,school_fees.agent_paid,school_fees.month_no,school_fees.id FROM school_fees JOIN agent ON school_fees.agent_code = agent.code JOIN exam ON exam.id = school_fees.exam_id JOIN school ON school.code = school_fees.school_code WHERE agent.code = $1 ORDER BY school_fees.agent_paid ASC", [agent_code]);
  if (result.rows.length === 0){
    res.render("report/agentReportByCode.ejs",{bool:true})
  }else{
    res.render("report/agentReportByCode.ejs",{display:result.rows,bool:false})
  }
})
app.post("/viewExamReportDetails",async (req,res)=>{
  let exam_code = req.body.code
  let result = await db.query("SELECT school.name, exam.*, examiner.name AS exam_taker,examiner.code AS examinercode FROM exam JOIN school ON school.code = exam.school_code JOIN examiner ON exam.examiner_code = examiner.code WHERE exam.id = $1",[exam_code])
  res.render("report/exam_report_details.ejs",{display:result.rows,bool:false})
})
app.post("/editReportExamInitiate", (req,res)=>{
  res.render("report/edit_exam_report.ejs", { name : req.body.name, examid: req.body.examid, date: req.body.date, fees: req.body.fees, food: req.body.food, travel: req.body.travel, direct_candidate: req.body.direct_candidate, direct_candidate_fees: req.body.direct_candidate_fees });
})
app.post("/editExamReport",async (req, res) => {
  let examid = req.body.examid;
  let date = req.body.date;
  let fees = req.body.fees;
  let food = req.body.food;
  let travel = req.body.travel;
  let direct_candidate = req.body.direct_candidate;
  let direct_candidate_fees = req.body.direct_candidate_fees;

  let field = [];
  let values = [];
  let paramCount = 1;
 
  if (date) {
      field.push(`date = $${paramCount}`);
      values.push(date);
      paramCount++;
  }
  if (fees) {
    field.push(`fees = $${paramCount}`);
    values.push(fees);
    paramCount++;
  }
  if (food) {
    field.push(`food = $${paramCount}`);
    values.push(food);
    paramCount++;
  }
  if (travel) {
    field.push(`transport = $${paramCount}`);
    values.push(travel);
    paramCount++;
  }
  if (direct_candidate) {
    field.push(`direct_candidate = $${paramCount}`);
    values.push(direct_candidate);
    paramCount++;
  }
  if (direct_candidate_fees) {
    field.push(`direct_candidate_fees = $${paramCount}`);
    values.push(direct_candidate_fees);
    paramCount++;
  }


  values.push(examid); // Add the original code as the last parameter

  if (field.length === 0) {
      console.log("No change");
      res.render("index.ejs",{message:"No changes added"});
      return; // Exit early if no fields to update
  }

  // Construct the SQL query dynamically
  let setClause = field.join(', ');
  let queryText = `UPDATE exam SET ${setClause} WHERE id = $${paramCount}`;
  try {
      await db.query(queryText, values);
      let result = await db.query("SELECT school.name, exam.*, examiner.name AS exam_taker FROM exam JOIN school ON school.code = exam.school_code JOIN examiner ON exam.examiner_code = examiner.code WHERE exam.id = $1",[examid])
      res.render("report/exam_report_details.ejs",{display:result.rows,bool:false})
  } catch (err) {
      console.error("Error updating school:", err);
      // Handle error appropriately, possibly show an error page
      res.status(500).send("Error updating school");
  }
});
app.post("/generateReport",async (req, res) =>{
  let mcount = req.body.maxCount;
  let count = req.body.count;
  if (count > mcount){
    console.log("Exam count exceeds limit");
    res.render("index.ejs",{message:"Exam count exceeds limit"})
  }
  else{
    var data = []
    for (var i= 0;i<count;i++){
      let name = "examid"+i;
      let exam_id = req.body[name]; 
      let result = await db.query("SELECT school.name, exam.*, examiner.name AS exam_taker,examiner.phone FROM exam JOIN school ON school.code = exam.school_code JOIN examiner ON exam.examiner_code = examiner.code WHERE exam.id = $1",[exam_id])
      data.push(result.rows[0])
      var d = new Date();
      await db.query("UPDATE exam SET examiner_paid = true WHERE exam.id = $1",[exam_id])
    }
    res.render("report/report.ejs",{count:count,display: data, date:d})
  }
})
app.post("/generateAgentReport", async(req,res)=>{
  let mcount = req.body.maxCount;
  let month = req.body.month;
  var c = 0;
  var data = []
  for (var i= 0;i<mcount;i++){
      let name = "formid"+i;
      let form_id = req.body[name];
      let tresult = await db.query("SELECT school_fees.month FROM school_fees WHERE id = $1",[form_id])
      let resultMonth = tresult.rows[0].month.toLowerCase()
      if(month.toLowerCase() === resultMonth){
        c++;
        let result = await db.query("SELECT agent.name AS agentname,agent.contact, school.name AS schoolname, school.zone,school.commission AS comm, exam.session, exam.forms, exam.collection, school_fees.date, school_fees.month, school_fees.agent_commission,school_fees.agent_paid,school_fees.month_no,school_fees.id FROM school_fees JOIN agent ON school_fees.agent_code = agent.code JOIN exam ON exam.id = school_fees.exam_id JOIN school ON school.code = school_fees.school_code WHERE school_fees.id = $1 ORDER BY school.zone",[form_id])
        data.push(result.rows[0]) 
        var d = new Date();
        await db.query("UPDATE school_fees SET agent_paid = true WHERE id = $1",[form_id])
      }
  }
  if(c === 0){
    res.render("index.ejs",{message:"There is no collection from entered month"})
  }else{
    res.render("report/agentReport.ejs",{count:c,display: data, date:d})
  }
})





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  const closeDatabase = async () => {
    try {
      await db.end();
      console.log("Database connection closed.");
    } catch (err) {
      console.error("Error closing the database connection:", err);
    }
  };
  
  // Handle graceful shutdown
  process.on("SIGTERM", closeDatabase);
  process.on("SIGINT", closeDatabase);  