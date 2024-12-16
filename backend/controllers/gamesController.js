import Games from "../models/gamesModel.js";
import fs from 'fs';
import path from 'path';

const createGame = async (req, res) => {
    const { title, description } = req.body;

    const logo = req.files?.['logo']?.[0]?.filename || null;
    const mobile_build = req.files?.['mobile_build']?.[0]?.filename || null;
    const web_build_framework = req.files?.['web_build_framework']?.[0]?.filename || null;
    const web_build_wasm = req.files?.['web_build_wasm']?.[0]?.filename || null;
    const web_build_loader = req.files?.['web_build_loader']?.[0]?.filename || null;
    const web_build_data = req.files?.['web_build_data']?.[0]?.filename || null;

    const deleteFileIfExists = (filePath) => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    if (!title || title.trim() === "") {
        if (logo) deleteFileIfExists(path.join('uploads/logos', logo));
        if (mobile_build) deleteFileIfExists(path.join('uploads/builds/mobile', mobile_build));
        if (web_build_framework) deleteFileIfExists(path.join('uploads/builds/web/framework', web_build_framework));
        if (web_build_wasm) deleteFileIfExists(path.join('uploads/builds/web/wasm', web_build_wasm));
        if (web_build_loader) deleteFileIfExists(path.join('uploads/builds/web/loader', web_build_loader));
        if (web_build_data) deleteFileIfExists(path.join('uploads/builds/web/data', web_build_data));

        return res.status(400).json({ message: "Title is required and cannot be empty." });
    }

    try {
        const baseUrl = process.env.FILE_UPLOAD_BASE_URL;
        const logoUrl = logo ? `${baseUrl}/uploads/logos/${logo}` : null;
        const mobileBuildUrl = mobile_build ? `${baseUrl}/uploads/builds/mobile/${mobile_build}` : null;
        const webBuildFrameworkUrl = web_build_framework ? `${baseUrl}/uploads/builds/web/${web_build_framework}` : null;
        const webBuildWasmUrl = web_build_wasm ? `${baseUrl}/uploads/builds/web/${web_build_wasm}` : null;
        const webBuildLoaderUrl = web_build_loader ? `${baseUrl}/uploads/builds/web/${web_build_loader}` : null;
        const webBuildDataUrl = web_build_data ? `${baseUrl}/uploads/builds/web/${web_build_data}` : null;

        const game = await Games.create({
            title,
            description,
            logo: logoUrl,
            mobile_build: mobileBuildUrl,
            web_build_framework: webBuildFrameworkUrl,
            web_build_wasm: webBuildWasmUrl,
            web_build_loader: webBuildLoaderUrl,
            web_build_data: webBuildDataUrl
        });

        res.status(201).json({
            _id: game._id,
            title: game.title,
            description: game.description,
            logo: game.logo,
            mobile_build: game.mobile_build,
            web_build_framework: game.web_build_framework,
            web_build_wasm: game.web_build_wasm,
            web_build_loader: game.web_build_loader,
            web_build_data: game.web_build_data
        });
    } catch (error) {
        if (logo) deleteFileIfExists(path.join('uploads/logos', logo));
        if (mobile_build) deleteFileIfExists(path.join('uploads/builds/mobile', mobile_build));
        if (web_build_framework) deleteFileIfExists(path.join('uploads/builds/web/framework', web_build_framework));
        if (web_build_wasm) deleteFileIfExists(path.join('uploads/builds/web/wasm', web_build_wasm));
        if (web_build_loader) deleteFileIfExists(path.join('uploads/builds/web/loader', web_build_loader));
        if (web_build_data) deleteFileIfExists(path.join('uploads/builds/web/data', web_build_data));

        res.status(500).json({ message: "Failed to create game", error: error.message });
    }
};

const displayAllGames = async (req, res) => {
    try {
        const games = await Games.find();
        if (!games.length) {
            return res.status(404).json({ message: "No games found." });
        }

        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch games", error: error.message });
    }
};

const deleteGame = async (req, res) => {
    const { gameId } = req.params;

    if (!gameId) {
        return res.status(400).json({ message: "Game ID is required." });
    }

    try {
        const game = await Games.findByIdAndDelete(gameId);

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }

        res.status(200).json({ message: "Game deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete game", error: error.message });
    }
};

const updateGame = async (req, res) => {
    const { gameId } = req.params;
    const { title, description } = req.body;

    const logo = req.files['logo'] ? req.files['logo'][0].filename : null;
    const mobileBuild = req.files['mobile_build'] ? req.files['mobile_build'][0].filename : null;
    const webBuildFramework = req.files['web_build_framework'] ? req.files['web_build_framework'][0].filename : null;
    const webBuildWasm = req.files['web_build_wasm'] ? req.files['web_build_wasm'][0].filename : null;
    const webBuildLoader = req.files['web_build_loader'] ? req.files['web_build_loader'][0].filename : null;
    const webBuildData = req.files['web_build_data'] ? req.files['web_build_data'][0].filename : null;

    const deleteFileIfExists = (filePath) => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    if (!title || title.trim() === "") {
        if (logo) deleteFileIfExists(path.join('uploads/logos', logo));
        if (mobileBuild) deleteFileIfExists(path.join('uploads/builds/mobile', mobileBuild));
        if (webBuildFramework) deleteFileIfExists(path.join('uploads/builds/web/framework', webBuildFramework));
        if (webBuildWasm) deleteFileIfExists(path.join('uploads/builds/web/wasm', webBuildWasm));
        if (webBuildLoader) deleteFileIfExists(path.join('uploads/builds/web/loader', webBuildLoader));
        if (webBuildData) deleteFileIfExists(path.join('uploads/builds/web/data', webBuildData));

        return res.status(400).json({ message: "Title is required and cannot be empty." });
    }

    try {
        const baseUrl = process.env.FILE_UPLOAD_BASE_URL || 'http://localhost:5000';
        const logoUrl = logo ? `${baseUrl}/uploads/logos/${logo}` : null;
        const mobileBuildURL = mobileBuild ? `${baseUrl}/uploads/builds/mobile/${mobileBuild}` : null;
        const webBuildFrameworkUrl = webBuildFramework ? `${baseUrl}/uploads/builds/web/${webBuildFramework}` : null;
        const webBuildWasmUrl = webBuildWasm ? `${baseUrl}/uploads/builds/web/${webBuildWasm}` : null;
        const webBuildLoaderUrl = webBuildLoader ? `${baseUrl}/uploads/builds/web/${webBuildLoader}` : null;
        const webBuildDataUrl = webBuildData ? `${baseUrl}/uploads/builds/web/${webBuildData}` : null;

        const game = await Games.findByIdAndUpdate(
            gameId,
            {
                title,
                description,
                logo: logoUrl,
                mobile_build: mobileBuildURL,
                web_build_framework: webBuildFrameworkUrl,
                web_build_wasm: webBuildWasmUrl,
                web_build_loader: webBuildLoaderUrl,
                web_build_data: webBuildDataUrl
            },
            { new: true }
        );

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }

        res.status(200).json({
            _id: game._id,
            title: game.title,
            description: game.description,
            logo: game.logo,
            mobile_build: game.mobile_build,
            web_build_framework: game.web_build_framework,
            web_build_wasm: game.web_build_wasm,
            web_build_loader: game.web_build_loader,
            web_build_data: game.web_build_data
        });
    } catch (error) {
        if (logo) deleteFileIfExists(path.join('uploads/logos', logo));
        if (mobileBuild) deleteFileIfExists(path.join('uploads/builds/mobile', mobileBuild));
        if (webBuildFramework) deleteFileIfExists(path.join('uploads/builds/web/framework', webBuildFramework));
        if (webBuildWasm) deleteFileIfExists(path.join('uploads/builds/web/wasm', webBuildWasm));
        if (webBuildLoader) deleteFileIfExists(path.join('uploads/builds/web/loader', webBuildLoader));
        if (webBuildData) deleteFileIfExists(path.join('uploads/builds/web/data', webBuildData));

        res.status(500).json({ message: "Failed to update game", error: error.message });
    }
};


export {
    createGame,
    displayAllGames,
    deleteGame,
    updateGame
};
