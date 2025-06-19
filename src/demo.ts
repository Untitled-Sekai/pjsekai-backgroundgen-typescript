import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { render, render_v1, render_v3, RgbaImage } from './index';

async function runDemo() {
    try {

        const img = await loadImage(path.resolve(__dirname, '../test.png'));
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const testImage: RgbaImage = {
            canvas,
            width: img.width,
            height: img.height
        };


        const distDir = path.resolve(__dirname, '../examples');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }


        console.log('V3バージョンでレンダリング中...');
        const v3Result = await render_v3(testImage);
        const v3Out = fs.createWriteStream(path.join(distDir, 'demo_v3.png'));
        const v3Stream = v3Result.canvas.createPNGStream();
        v3Stream.pipe(v3Out);


        console.log('V1バージョンでレンダリング中...');
        const v1Result = await render_v1(testImage);
        const v1Out = fs.createWriteStream(path.join(distDir, 'demo_v1.png'));
        const v1Stream = v1Result.canvas.createPNGStream();
        v1Stream.pipe(v1Out);

        console.log('デモ画像は examples/ ディレクトリに保存されました');
    } catch (error) {
        console.error('デモの実行中にエラーが発生しました:', error);
    }
}

runDemo();