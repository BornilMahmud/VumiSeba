import assert from 'node:assert/strict';
import { runSeed } from '../db/seed.js';
import { RiskEngine } from '../services/riskEngine.js';

async function runRiskEngineTests() {
  console.log('🧪 Starting Phase 3: Risk Engine Transparency & Critical Overrides Test Suite...\n');

  // Re-seed with fresh synthetic test data
  await runSeed();

  // Test 1: Clean title parcel yields Low Risk with full factor breakdown
  console.log('Test 1: Clean Title Parcel transparency evaluation...');
  const cleanAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-clean-405',
    sellerNidOrCitizenId: '19852691029384756', // Rafiqul
    proposedShare: 0.05,
  });

  assert.equal(cleanAssessment.overall_risk_level, 'low', 'Clean parcel should evaluate to low risk');
  assert.ok(cleanAssessment.risk_score >= 85, `Score should be >= 85, got ${cleanAssessment.risk_score}`);
  assert.equal(cleanAssessment.critical_override_triggered, false, 'Override should not trigger on clean parcel');
  assert.ok(cleanAssessment.factors && cleanAssessment.factors.length >= 7, 'Should contain all factor breakdowns');
  assert.equal(cleanAssessment.engine_version, 'v2.2-transparency', 'Should contain engine version');
  assert.ok(cleanAssessment.disclaimer_bn!.includes('আইনি দলিল'), 'Should include Bengali legal disclaimer');
  assert.ok(cleanAssessment.disclaimer_en!.includes('formal legal certificate'), 'Should include English disclaimer');
  console.log('   ✅ Clean title parcel verified: Low Risk with complete transparent factor breakdown.');

  // Test 2: Injunction Hard Override (Can NEVER display Low Risk)
  console.log('Test 2: Active Court Injunction critical override...');
  const injunctionAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-court-710',
  });

  assert.equal(injunctionAssessment.overall_risk_level, 'critical', 'Injunction MUST force critical risk');
  assert.equal(injunctionAssessment.critical_override_triggered, true, 'Override must be marked true');
  assert.ok(injunctionAssessment.risk_score <= 25, `Score must be capped at 25, got ${injunctionAssessment.risk_score}`);
  const courtFactor = injunctionAssessment.factors?.find((f) => f.factor_key === 'court_injunction');
  assert.equal(courtFactor?.status, 'failed', 'Court injunction factor must be failed');
  assert.equal(courtFactor?.is_critical, true, 'Court injunction must be marked as critical');
  console.log('   ✅ Court Injunction critical override verified: forced Critical risk and score cap.');

  // Test 3: Government Khas Land Override
  console.log('Test 3: 100% Government Khas Land critical override...');
  const khasAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-khas-770',
  });

  assert.equal(khasAssessment.overall_risk_level, 'critical', 'Khas land MUST force critical risk');
  assert.equal(khasAssessment.critical_override_triggered, true, 'Override must trigger on khas land');
  const khasFactor = khasAssessment.factors?.find((f) => f.factor_key === 'government_land');
  assert.equal(khasFactor?.status, 'failed', 'Government land factor must fail');
  console.log('   ✅ Government Khas land critical override verified.');

  // Test 4: Bank Mortgage Override
  console.log('Test 4: Bank Mortgage encumbrance override...');
  const mortgageAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-mortgage-215',
    sellerNidOrCitizenId: '19809112039485716',
  });

  assert.notEqual(mortgageAssessment.overall_risk_level, 'low', 'Mortgaged parcel can NEVER be Low risk');
  assert.ok(mortgageAssessment.overall_risk_level === 'high' || mortgageAssessment.overall_risk_level === 'critical');
  assert.equal(mortgageAssessment.critical_override_triggered, true, 'Mortgage must trigger critical override');
  const mortgageFactor = mortgageAssessment.factors?.find((f) => f.factor_key === 'bank_mortgage');
  assert.equal(mortgageFactor?.status, 'failed', 'Mortgage factor must fail');
  console.log('   ✅ Bank Mortgage encumbrance override verified.');

  // Test 5: Over-Selling Share Limit Override
  console.log('Test 5: Over-Selling Share Limit critical override...');
  const oversellAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-oversell-102',
    sellerNidOrCitizenId: '19822695028371948', // Nazrul (owns 0.125)
    proposedShare: 0.50, // Attempts 0.50 (4x available!)
  });

  assert.notEqual(oversellAssessment.overall_risk_level, 'low', 'Over-selling can NEVER display Low risk');
  assert.equal(oversellAssessment.overall_risk_level, 'high', 'Over-selling must evaluate to high risk');
  assert.equal(oversellAssessment.critical_override_triggered, true, 'Over-selling must trigger critical override');
  const shareFactor = oversellAssessment.factors?.find((f) => f.factor_key === 'share_validation');
  assert.equal(shareFactor?.status, 'failed', 'Share validation factor must fail');
  console.log('   ✅ Over-Selling share limit override verified.');

  // Test 6: Tax Overdue Evaluation
  console.log('Test 6: Tax Overdue evaluation...');
  const taxAssessment = await RiskEngine.assessParcel({
    parcelId: 'pcl-taxdue-882',
    sellerNidOrCitizenId: '19782691099381726',
    proposedShare: 0.10,
  });

  assert.equal(taxAssessment.overall_risk_level, 'medium', 'Tax arrears should evaluate to medium risk');
  const taxFactor = taxAssessment.factors?.find((f) => f.factor_key === 'tax_compliance');
  assert.equal(taxFactor?.status, 'failed', 'Tax compliance factor must fail due to arrears');
  assert.ok(taxFactor?.explanation_bn.includes('৪,৮৫০'), 'Explanation should state exact arrears amount');
  console.log('   ✅ Tax overdue evaluation verified with exact arrears details.');

  // Test 7: Table-Driven Factor & Boundary Matrix
  console.log('Test 7: Table-driven factor and boundary test matrix...');
  const testMatrix = [
    {
      description: 'Clean Title (Pcl 405)',
      parcelId: 'pcl-clean-405',
      sellerId: '19852691029384756',
      share: 0.05,
      expectedLevel: 'low',
      expectedOverride: false,
    },
    {
      description: 'Tax Arrears (Pcl 882)',
      parcelId: 'pcl-taxdue-882',
      sellerId: '19782691099381726',
      share: 0.10,
      expectedLevel: 'medium',
      expectedOverride: false,
    },
    {
      description: 'Over-Selling (Pcl 102)',
      parcelId: 'pcl-oversell-102',
      sellerId: '19822695028371948',
      share: 0.40,
      expectedLevel: 'high',
      expectedOverride: true,
    },
    {
      description: 'Court Dispute (Pcl 710)',
      parcelId: 'pcl-court-710',
      sellerId: undefined,
      share: undefined,
      expectedLevel: 'critical',
      expectedOverride: true,
    },
    {
      description: 'Bank Mortgage (Pcl 215)',
      parcelId: 'pcl-mortgage-215',
      sellerId: '19809112039485716',
      share: 0.10,
      expectedLevel: 'high',
      expectedOverride: true,
    },
    {
      description: 'Khas Land (Pcl 770)',
      parcelId: 'pcl-khas-770',
      sellerId: undefined,
      share: undefined,
      expectedLevel: 'critical',
      expectedOverride: true,
    },
  ];

  for (const tc of testMatrix) {
    const res = await RiskEngine.assessParcel({
      parcelId: tc.parcelId,
      sellerNidOrCitizenId: tc.sellerId,
      proposedShare: tc.share,
    });
    assert.equal(res.overall_risk_level, tc.expectedLevel, `Matrix failed for ${tc.description}`);
    assert.equal(res.critical_override_triggered, tc.expectedOverride, `Override mismatch for ${tc.description}`);
  }
  console.log('   ✅ Table-driven matrix of 6 distinct boundary scenarios passed.');

  console.log('\n🎉 ALL PHASE 3 RISK ENGINE TRANSPARENCY TESTS PASSED!');
}

runRiskEngineTests().catch((err) => {
  console.error('❌ Phase 3 Test Failure:', err);
  process.exit(1);
});
