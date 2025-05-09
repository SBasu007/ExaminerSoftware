CREATE TABLE school(
    id SERIAL,
    code TEXT PRIMARY KEY NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(11),
    address VARCHAR(100),
    principal VARCHAR(100),
    zone CHAR(1),
    commission INT
);
CREATE TABLE examiner(
    id SERIAL,
    code TEXT PRIMARY KEY NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(11),
    phone2 TEXT,
    address1 TEXT,
    address2 TEXT
);
CREATE TABLE exam(
    id SERIAL PRIMARY KEY,
    session VARCHAR(50),
    examiner_code TEXT REFERENCES examiner(code),
    direct_candidate INT,
    TA FLOAT,
    fees FLOAT,
    school_code TEXT REFERENCES school(code),
    conducted BOOLEAN,
    date DATE,
    examiner_paid BOOLEAN,
    direct_candidate_fees FLOAT,
    students INT
);
CREATE TABLE agent(
	id SERIAL,
	code TEXT PRIMARY KEY NOT NULL,
	name varchar(100),
	contact varchar(11)
)
CREATE TABLE school_fees(
    id SERIAL PRIMARY KEY,
    agent_code TEXT REFERENCES agent(code),
    exam_id INT REFERENCES exam(id),
    school_code TEXT REFERENCES school(code),
    date TEXT,
    month TEXT,
    agent_commission FLOAT,
    agent_paid BOOLEAN,
    month_no INT
)
CREATE TABLE pending_exam(
    exam_id INT REFERENCES exam(id),
    examiner_code TEXT REFERENCES examiner(code),
    PRIMARY(exam_id,examiner_code)
);