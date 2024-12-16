import Bundle from "../models/bundleModel.js";

const createBundle = async (req, res) => {
    const { title, description, price, credits } = req.body;

    if (
        !title || title.trim() === "" ||
        !description || description.trim() === "" ||
        !price || isNaN(price) || price <= 0 ||
        !credits || isNaN(credits) || credits <= 0
    ) {
        return res.status(400).json({ message: "All fields (title, description, price, credits) are required and must be valid." });
    }

    try {
        const bundle = await Bundle.create({ title, description, price, credits });

        res.status(201).json({
            _id: bundle._id,
            title: bundle.title,
            description: bundle.description,
            price: bundle.price,
            credits: bundle.credits,
        });
    } catch (error) {

        res.status(500).json({ message: "Failed to create bundle", error: error.message });
    }
};

const getAllBundles = async (req, res) => {
    try {
        const bundles = await Bundle.find().select('title description _id price credits');

        if (!bundles.length) {
            return res.status(404).json({ message: "No Bundles found." });
        }
        res.status(200).json(bundles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bundles", error: error.message });
    }
};

const deleteBundle = async (req, res) => {
    const { bundleId } = req.params;

    if (!bundleId) {
        return res.status(400).json({ message: "Bundle ID is required." });
    }

    try {
        const bundle = await Bundle.findByIdAndDelete(bundleId);

        if (!bundle) {
            return res.status(404).json({ message: "Bundle not found." });
        }

        res.status(200).json({ message: "Bundle deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete Bundle", error: error.message });
    }
};

const updateBundle = async (req, res) => {
    const { bundleId } = req.params;
    const { title, description, price, credits } = req.body;

    if (
        !title || title.trim() === "" ||
        !description || description.trim() === "" ||
        !price || isNaN(price) || price <= 0 ||
        !credits || isNaN(credits) || credits <= 0
    ) {
        return res.status(400).json({ message: "All fields (title, description, price, credits) are required and must be valid." });
    }

    try {
        const bundle = await Bundle.findByIdAndUpdate(
            bundleId,
            { title, description, price, credits },
            { new: true }
        );

        if (!bundle) {
            return res.status(404).json({ message: "Bundle not found." });
        }

        res.status(200).json({
            _id: bundle._id,
            title: bundle.title,
            description: bundle.description,
            price: bundle.price,
            credits: bundle.credits,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update bundle", error: error.message });
    }
};

export {
    createBundle,
    getAllBundles,
    deleteBundle,
    updateBundle
};
