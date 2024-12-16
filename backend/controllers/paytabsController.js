import express from "express";
import PayTabs from "paytabs_pt2";
import Bundle from "../models/bundleModel.js";
import User from "../models/userModel.js"
import crypto from "crypto"

class PaytabsController {
    static profileID = process.env.PAYTABS_PROFILE_ID;
    static serverKey = process.env.PAYTABS_SERVER_KEY;
    static region = process.env.PAYTABS_REGION;

    static setPayTabsConfig() {
        const {
            PAYTABS_PROFILE_ID,
            PAYTABS_SERVER_KEY,
            PAYTABS_REGION
        } = process.env;

        PayTabs.setConfig(PAYTABS_PROFILE_ID, PAYTABS_SERVER_KEY, PAYTABS_REGION);
    }

    static async createPayment(req, res) {




        const { userId, bundleId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const bundle = await Bundle.findById(bundleId);
        if (!bundle) {
            return res.status(404).json({ message: "Bundle not found" });
        }
        try {
            PaytabsController.setPayTabsConfig();

            const paymentMethods = ["all"];
            const transaction_details = ["sale", "ecom"];

            const cart_details = [
                bundle._id.toString(),
                process.env.PAYTABS_CURRENCY,
                bundle.price,
                bundle.title
            ];
            const customer_details = [
                user.name,
                user.email,
                "66666",
            ];

            const shipping_address = customer_details;

            let backendUrl = process.env.BACKEND_URL;
            let url_response = `${backendUrl}/api/payment/response`;
            let url_callback = `${backendUrl}/api/payment/callback`;

            const response_url = [url_response, url_callback];

            const lang = "en";

            const paymentPageCreated = function (result) {
                if (result.redirect_url) {
                    res.json({ payment_url: result.redirect_url });
                } else {
                    res.status(400).json({ error: result.result });
                }
            };

            PayTabs.createPaymentPage(
                paymentMethods,
                transaction_details,
                cart_details,
                customer_details,
                shipping_address,
                response_url,
                lang,
                paymentPageCreated,
            )

        } catch (error) {
            console.error("Error in creating payment page:", error);
            res.status(500).send("Error processing payment");
        }
    }

    static isGenuine(payload, requestSignature, serverKey) {

        const filteredParams = Object.fromEntries(
            Object.entries(payload).filter(([key, value]) => value !== '' && key !== 'signature')
        );

        const sortedParams = Object.keys(filteredParams).sort();

        const queryString = sortedParams
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filteredParams[key])}`)
            .join('&');

        const signature = crypto
            .createHmac('sha256', serverKey)
            .update(queryString)
            .digest('hex');

        return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(requestSignature, 'utf8'));
    }

    static async handlePostCallback(req, res) {
        let frontendUrl = process.env.FRONTEND_URL;
        const { respStatus, cartId: bundleID, customerEmail, signature } = req.body;
        let serverKey = process.env.PAYTABS_SERVER_KEY
        const payload = { ...req.body };

        if (respStatus === 'A') {

            const isValid = PaytabsController.isGenuine(payload, signature, serverKey);

            if (isValid) {

                const bundle = await Bundle.findById(bundleID);
                if (!bundle) {
                    return res.status(400).json({ message: "The bundle not found" });
                }

                const user = await User.findOne({ email: customerEmail });
                if (!user) {
                    return res.status(400).json({ message: "User not found" });
                }

                const existingBundle = user.bundles.find(b =>
                    b.bundleId.toString() === bundle._id.toString()
                );
                if (existingBundle) {
                    existingBundle.timesSubscribed += 1
                    existingBundle.totalCoins += bundle.credits
                    user.coins += bundle.credits
                }
                else {
                    user.bundles.push({
                        bundleId: bundleID,
                        timesSubscribed: 1,
                        totalCoins: bundle.credits,
                    })
                    user.coins = user.coins + bundle.credits
                }
                await user.save();
                res.redirect(`${frontendUrl}/products`);
            } else {
                return res.status(400).send('Payment failed');
            }
        }
        else {
            return res.status(400).json({ message: "Payment failed" })
        }
    }

    static async serverResponse(req, res) {
        res.status(200).json({ message: "Payment is Done" })
    }

}

export default PaytabsController;
