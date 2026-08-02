CREATE TABLE IF NOT EXISTS app_users(
  id BIGSERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workflow_cases(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,reference TEXT UNIQUE NOT NULL,subject TEXT NOT NULL,owner TEXT NOT NULL,state TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,payload JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_events(
  id BIGSERIAL PRIMARY KEY,event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),actor TEXT NOT NULL,action TEXT NOT NULL,object_type TEXT NOT NULL,object_reference TEXT NOT NULL,detail TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS saved_analyses(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,actor TEXT NOT NULL,analysis_type TEXT NOT NULL,inputs JSONB NOT NULL,result JSONB NOT NULL,provider TEXT NOT NULL,model TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS integration_state(
  id TEXT PRIMARY KEY,name TEXT NOT NULL,category TEXT NOT NULL,mode TEXT NOT NULL,status TEXT NOT NULL,last_tested TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_workflow ON workflow_cases(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_due ON workflow_cases(due_date);
CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(event_time DESC);

CREATE TABLE IF NOT EXISTS "op_vamp_monitor"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_merchantId" TEXT NOT NULL,
  "data_period" TEXT NOT NULL,
  "data_transactionCount" NUMERIC(16,2) NOT NULL,
  "data_disputeCount" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_vamp_monitor_due ON "op_vamp_monitor"(due_date);

CREATE TABLE IF NOT EXISTS "op_representment"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_disputeId" TEXT NOT NULL,
  "data_reasonCode" TEXT NOT NULL,
  "data_transactionAmount" NUMERIC(16,2) NOT NULL,
  "data_evidenceSummary" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_representment_due ON "op_representment"(due_date);

CREATE TABLE IF NOT EXISTS "op_prevention"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_merchant" TEXT NOT NULL,
  "data_descriptor" TEXT NOT NULL,
  "data_disputePattern" TEXT NOT NULL,
  "data_channel" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_prevention_due ON "op_prevention"(due_date);

CREATE TABLE IF NOT EXISTS "op_fraud_signal"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_signalId" TEXT NOT NULL,
  "data_signalType" TEXT NOT NULL,
  "data_riskLevel" TEXT NOT NULL,
  "data_signalEvidence" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_fraud_signal_due ON "op_fraud_signal"(due_date);

CREATE TABLE IF NOT EXISTS "op_alert_response"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_alertReference" TEXT NOT NULL,
  "data_program" TEXT NOT NULL,
  "data_responseDue" DATE NOT NULL,
  "data_remediationPlan" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_alert_response_due ON "op_alert_response"(due_date);

CREATE TABLE IF NOT EXISTS "op_merchant_onboarding"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_merchant" TEXT NOT NULL,
  "data_businessModel" TEXT NOT NULL,
  "data_monthlyVolume" NUMERIC(16,2) NOT NULL,
  "data_riskNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_merchant_onboarding_due ON "op_merchant_onboarding"(due_date);

CREATE TABLE IF NOT EXISTS "op_recovery"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_portfolio" TEXT NOT NULL,
  "data_period" TEXT NOT NULL,
  "data_submittedAmount" NUMERIC(16,2) NOT NULL,
  "data_recoveredAmount" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_recovery_due ON "op_recovery"(due_date);

CREATE TABLE IF NOT EXISTS "op_policy"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_policyArea" TEXT NOT NULL,
  "data_currentPolicy" TEXT NOT NULL,
  "data_observedIssue" TEXT NOT NULL,
  "data_owner" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_policy_due ON "op_policy"(due_date);

CREATE TABLE IF NOT EXISTS "op_merchant_portfolio"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_merchantId" TEXT NOT NULL,
  "data_merchant" TEXT NOT NULL,
  "data_channel" TEXT NOT NULL,
  "data_monthlyVolume" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_merchant_portfolio_due ON "op_merchant_portfolio"(due_date);

CREATE TABLE IF NOT EXISTS "op_reason_codes"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_network" TEXT NOT NULL,
  "data_reasonCode" TEXT NOT NULL,
  "data_responseDays" NUMERIC(16,2) NOT NULL,
  "data_requiredEvidence" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_reason_codes_due ON "op_reason_codes"(due_date);

CREATE TABLE IF NOT EXISTS "op_acquirer_alerts"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_acquirer" TEXT NOT NULL,
  "data_alertType" TEXT NOT NULL,
  "data_ratioBps" NUMERIC(16,2) NOT NULL,
  "data_responseDue" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_acquirer_alerts_due ON "op_acquirer_alerts"(due_date);

CREATE TABLE IF NOT EXISTS "op_evidence_templates"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_template" TEXT NOT NULL,
  "data_reasonCode" TEXT NOT NULL,
  "data_businessModel" TEXT NOT NULL,
  "data_evidenceChecklist" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_evidence_templates_due ON "op_evidence_templates"(due_date);
