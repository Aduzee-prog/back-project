#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendDonorWelcomeEmail, sendNGOWelcomeEmail } = require('./utils/emailService');

const Donor = require('./models/donor.models');
const NGO = require('./models/ngo.models');

const MONGO_URI = process.env.MONGO_URI;

async function verifyEmailFlow() {
    try {
        console.log('='.repeat(60));
        console.log('EMAIL FLOW VERIFICATION TEST');
        console.log('='.repeat(60));

        // Connect to MongoDB
        console.log('\n📊 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        // Test 1: Email function directly
        console.log('\n📧 Test 1: Direct Email Function Call');
        console.log('-'.repeat(60));
        const emailResult = await sendDonorWelcomeEmail('Test User', 'timetomisin@gmail.com');
        console.log('Result:', emailResult);
        console.log(emailResult.success ? '✅ Direct email test PASSED' : '❌ Direct email test FAILED');

        // Test 2: Donor Signup Flow
        console.log('\n👤 Test 2: Donor Signup Email Flow');
        console.log('-'.repeat(60));
        const testDonorEmail = `testdonor${Date.now()}@example.com`;
        console.log(`Creating test donor with email: ${testDonorEmail}`);
        
        try {
            const hashedPassword = await bcrypt.hash('testpassword123', 10);
            const testDonor = await Donor.create({
                name: 'Test Donor',
                email: testDonorEmail,
                password: hashedPassword,
            });
            console.log('✅ Test donor created in database');

            // Send welcome email
            const donorEmailResult = await sendDonorWelcomeEmail('Test Donor', testDonorEmail);
            console.log('Email result:', donorEmailResult);
            console.log(donorEmailResult.success ? '✅ Donor signup email PASSED' : '❌ Donor signup email FAILED');

            // Clean up
            await Donor.deleteOne({ _id: testDonor._id });
            console.log('✅ Test donor cleaned up');
        } catch (err) {
            if (err.message.includes('duplicate key')) {
                console.log('⚠️ Test donor already exists, skipping creation');
                const donorEmailResult = await sendDonorWelcomeEmail('Test Donor', testDonorEmail);
                console.log('Email result:', donorEmailResult);
            } else {
                throw err;
            }
        }

        // Test 3: NGO Signup Flow
        console.log('\n🏢 Test 3: NGO Signup Email Flow');
        console.log('-'.repeat(60));
        const testNGOEmail = `testngo${Date.now()}@example.com`;
        console.log(`Creating test NGO with email: ${testNGOEmail}`);
        
        try {
            const hashedPassword = await bcrypt.hash('testpassword123', 10);
            const testNGO = await NGO.create({
                name: 'Test Contact Person',
                email: testNGOEmail,
                password: hashedPassword,
                ngoName: 'Test NGO Organization',
                ngoDescription: 'Test Description',
                registrationStatus: 'pending_verification',
                registrationDoc: 'pending_verification'
            });
            console.log('✅ Test NGO created in database');

            // Send welcome email
            const ngoEmailResult = await sendNGOWelcomeEmail('Test Contact Person', testNGOEmail, 'Test NGO Organization');
            console.log('Email result:', ngoEmailResult);
            console.log(ngoEmailResult.success ? '✅ NGO signup email PASSED' : '❌ NGO signup email FAILED');

            // Clean up
            await NGO.deleteOne({ _id: testNGO._id });
            console.log('✅ Test NGO cleaned up');
        } catch (err) {
            if (err.message.includes('duplicate key')) {
                console.log('⚠️ Test NGO already exists, skipping creation');
                const ngoEmailResult = await sendNGOWelcomeEmail('Test Contact Person', testNGOEmail, 'Test NGO Organization');
                console.log('Email result:', ngoEmailResult);
            } else {
                throw err;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ VERIFICATION COMPLETE');
        console.log('='.repeat(60));
        console.log('\nKey Points to Check:');
        console.log('1. All email tests returned success: true');
        console.log('2. Check your inbox at: timetomisin@gmail.com');
        console.log('3. Look for emails from: timetomisin@gmail.com');
        console.log('4. Verify no SMTP errors in the output above');
        console.log('\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ ERROR:', err);
        await mongoose.disconnect();
        process.exit(1);
    }
}

verifyEmailFlow();
