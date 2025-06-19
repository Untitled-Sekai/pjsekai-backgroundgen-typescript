import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { render, render_v1, render_v3 } from '../src/lib';
import { RgbaImage } from '../src/assets';

describe('Background Generator Tests', () => {
    let testImage: RgbaImage;

    beforeAll(async () => {

        try {
            const img = await loadImage(path.join(__dirname, '../test.png'));
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            testImage = {
                canvas,
                width: img.width,
                height: img.height
            };
        } catch (error) {
            console.error('テスト画像のロードに失敗しました:', error);
            throw error;
        }
    });


    beforeAll(() => {
        const distDir = path.join(__dirname, '../dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
    });

    test('Default render should work', async () => {
        const result = await render(testImage);


        const out = fs.createWriteStream(path.join(__dirname, '../dist/latest.png'));
        const stream = result.canvas.createPNGStream();
        stream.pipe(out);

        await new Promise<void>((resolve) => {
            out.on('finish', () => {
                expect(fs.existsSync(path.join(__dirname, '../dist/latest.png'))).toBeTruthy();
                resolve();
            });
        });
    });

    test('V3 render should work', async () => {
        const result = await render_v3(testImage);


        const out = fs.createWriteStream(path.join(__dirname, '../dist/v3.png'));
        const stream = result.canvas.createPNGStream();
        stream.pipe(out);

        await new Promise<void>((resolve) => {
            out.on('finish', () => {
                expect(fs.existsSync(path.join(__dirname, '../dist/v3.png'))).toBeTruthy();
                resolve();
            });
        });
    });

    test('V1 render should work', async () => {
        const result = await render_v1(testImage);


        const out = fs.createWriteStream(path.join(__dirname, '../dist/v1.png'));
        const stream = result.canvas.createPNGStream();
        stream.pipe(out);

        await new Promise<void>((resolve) => {
            out.on('finish', () => {
                expect(fs.existsSync(path.join(__dirname, '../dist/v1.png'))).toBeTruthy();
                resolve();
            });
        });
    });
});