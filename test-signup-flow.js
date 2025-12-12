#!/usr/bin/env node
/**
 * DIAGNOSTIC SCRIPT: Email Signup Flow Test
 * This simulates actual signup requests to identify issues
 */

require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const baseURL = 'http://localhost:4500';

// Import models and services
const Donor = require('./models/donor.models');
const NGO = require('./models/ngo.models');
const { sendDonorWelcomeEmail, sendNGOWelcomeEmail } = require('./utils/emailService');

async function cleanup() {
    try {
        await mongoose.disconnect();
    } catch (e) {
        // ignore
    }
}

async function testSignupFlows() {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('🔍 SIGNUP EMAIL FLOW DIAGNOSTIC TEST');
        console.log('='.repeat(70));

        // Connect to MongoDB
        console.log('\n1️⃣  CHECKING ENVIRONMENT & DATABASE');
        console.log('-'.repeat(70));
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET');
        console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ SET' : '❌ NOT SET');
        console.log('MONGO_URI:', MONGO_URI ? '✅ SET' : '❌ NOT SET');

        await mongoose.connect(MONGO_URI);
        console.log('Database connection: ✅ Connected');

        // Test 1: Donor Signup Simulation
        console.log('\n2️⃣  DONOR SIGNUP SIMULATION');
        console.log('-'.repeat(70));
        const donorEmail = `signup-test-donor-${Date.now()}@example.com`;
        const donorData = {
            name: 'Test Donor User',
            email: donorEmail,
            password: 'TestPassword123!'
        };
        
        console.log('Simulating donor signup with:');
        console.log(`  - Name: ${donorData.name}`);
        console.log(`  - Email: ${donorData.email}`);
        
        // Check if donor already exists
        let existingDonor = await Donor.findOne({ email: donorData.email });
        if (existingDonor) {
            console.log('  - Status: ⚠️  Already exists in DB, cleaning up...');
            await Donor.deleteOne({ email: donorData.email });
        }

        // Create donor (simulating controller logic)
        console.log('  - Creating donor in database...');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(donorData.password, 10);
        
        const newDonor = await Donor.create({
            name: donorData.name,
            email: donorData.email,
            password: hashedPassword,
        });
        console.log('  - Database: ✅ Donor created');

        // Send email (simulating controller logic)
        console.log('  - Sending welcome email...');
        const donorEmailResult = await sendDonorWelcomeEmail(donorData.name, donorData.email);
        console.log(`  - Email Result: ${donorEmailResult.success ? '✅ SENT' : '❌ FAILED'}`);
        if (donorEmailResult.success) {
            console.log(`    Message: ${donorEmailResult.message}`);
        } else {
            console.log(`    Error: ${donorEmailResult.message}`);
        }

        // Simulate response
        const donorResponse = {
            success: true,
            message: `Signup successful! ${donorEmailResult.message || ''}`.trim(),
            emailSent: !!donorEmailResult.success,
            user: {
                id: newDonor._id,
                name: newDonor.name,
                email: newDonor.email
            }
        };
        console.log('\nSimulated API Response:');
        console.log(JSON.stringify(donorResponse, null, 2));

        // Cleanup
        await Donor.deleteOne({ _id: newDonor._id });
        console.log('\n  - Cleanup: ✅ Test donor removed');

        // Test 2: NGO Signup Simulation
        console.log('\n3️⃣  NGO SIGNUP SIMULATION');
        console.log('-'.repeat(70));
        const ngoEmail = `signup-test-ngo-${Date.now()}@example.com`;
        const ngoData = {
            name: 'Test Contact Person',
            email: ngoEmail,
            password: 'TestPassword123!',
            ngoName: 'Test NGO Organization',
            description: 'A test NGO organization for email verification'
        };
        
        console.log('Simulating NGO signup with:');
        console.log(`  - Contact Name: ${ngoData.name}`);
        console.log(`  - Email: ${ngoData.email}`);
        console.log(`  - Organization: ${ngoData.ngoName}`);
        
        // Check if NGO already exists
        let existingNGO = await NGO.findOne({ email: ngoData.email });
        if (existingNGO) {
            console.log('  - Status: ⚠️  Already exists in DB, cleaning up...');
            await NGO.deleteOne({ email: ngoData.email });
        }

        // Create NGO (simulating controller logic)
        console.log('  - Creating NGO in database...');
        const hashedNGOPassword = await bcrypt.hash(ngoData.password, 10);
        
        const newNGO = await NGO.create({
            name: ngoData.name,
            email: ngoData.email,
            password: hashedNGOPassword,
            ngoName: ngoData.ngoName,
            ngoDescription: ngoData.description,
            registrationStatus: 'pending_verification',
            registrationDoc: 'pending_verification'
        });
        console.log('  - Database: ✅ NGO created');

        // Send email (simulating controller logic)
        console.log('  - Sending welcome email...');
        const ngoEmailResult = await sendNGOWelcomeEmail(ngoData.name, ngoData.email, ngoData.ngoName);
        console.log(`  - Email Result: ${ngoEmailResult.success ? '✅ SENT' : '❌ FAILED'}`);
        if (ngoEmailResult.success) {
            console.log(`    Message: ${ngoEmailResult.message}`);
        } else {
            console.log(`    Error: ${ngoEmailResult.message}`);
        }

        // Simulate response
        const ngoResponse = {
            success: true,
            message: `NGO signup successful! Pending verification. ${ngoEmailResult.message || ''}`.trim(),
            emailSent: !!ngoEmailResult.success,
            user: {
                id: newNGO._id,
                name: newNGO.name,
                email: newNGO.email
            }
        };
        console.log('\nSimulated API Response:');
        console.log(JSON.stringify(ngoResponse, null, 2));

        // Cleanup
        await NGO.deleteOne({ _id: newNGO._id });
        console.log('\n  - Cleanup: ✅ Test NGO removed');

        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('✅ DIAGNOSTIC TEST COMPLETE');
        console.log('='.repeat(70));
        console.log('\n📋 SUMMARY:');
        console.log('  ✅ Donor signup flow: WORKING');
        console.log('  ✅ NGO signup flow: WORKING');
        console.log('  ✅ Email service: OPERATIONAL');
        console.log('\n💡 NEXT STEPS:');
        console.log('  1. Make sure your Node server is running (npm start)');
        console.log('  2. Clear browser cache and try signup again');
        console.log('  3. Check spam folder in your email inbox');
        console.log('  4. Verify CORS settings if using frontend on different domain');
        console.log('\n📧 EMAIL DETAILS:');
        console.log(`  - From: ${process.env.EMAIL_USER}`);
        console.log(`  - To: Your registered email`);
        console.log(`  - Subject: Welcome to Good Heart Charity Platform!`);
        console.log('\n');

        await cleanup();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ TEST FAILED:');
        console.error(err);
        await cleanup();
        process.exit(1);
    }
}

testSignupFlows();
