import { createCanvas, loadImage, Image, Canvas } from 'canvas';
import * as path from 'path';
import * as fs from 'fs';

export interface RgbaImage {
    canvas: Canvas;
    width: number;
    height: number;
}

export class V3Assets {
    base: RgbaImage;
    bottom: RgbaImage;
    center_cover: RgbaImage;
    center_mask: RgbaImage;
    side_cover: RgbaImage;
    side_mask: RgbaImage;
    windows: RgbaImage;

    private constructor(
        base: RgbaImage,
        bottom: RgbaImage,
        center_cover: RgbaImage,
        center_mask: RgbaImage,
        side_cover: RgbaImage,
        side_mask: RgbaImage,
        windows: RgbaImage
    ) {
        this.base = base;
        this.bottom = bottom;
        this.center_cover = center_cover;
        this.center_mask = center_mask;
        this.side_cover = side_cover;
        this.side_mask = side_mask;
        this.windows = windows;
    }

    private static instance: V3Assets | null = null;

    static async load(basePath: string = 'assets/v3'): Promise<V3Assets> {
        if (this.instance) return this.instance;


        const rootDir = path.resolve(__dirname, '..');
        const assetsPath = path.join(rootDir, basePath);

        try {

            const baseImg = await loadImage(path.join(assetsPath, 'base.png'));
            const bottomImg = await loadImage(path.join(assetsPath, 'bottom.png'));
            const centerCoverImg = await loadImage(path.join(assetsPath, 'center_cover.png'));
            const centerMaskImg = await loadImage(path.join(assetsPath, 'center_mask.png'));
            const sideCoverImg = await loadImage(path.join(assetsPath, 'side_cover.png'));
            const sideMaskImg = await loadImage(path.join(assetsPath, 'side_mask.png'));
            const windowsImg = await loadImage(path.join(assetsPath, 'windows.png'));


            this.instance = new V3Assets(
                imageToRgba(baseImg),
                imageToRgba(bottomImg),
                imageToRgba(centerCoverImg),
                imageToRgba(centerMaskImg),
                imageToRgba(sideCoverImg),
                imageToRgba(sideMaskImg),
                imageToRgba(windowsImg)
            );

            return this.instance;
        } catch (error) {
            console.error(`V3アセットの読み込みに失敗しました: ${error}`);
            console.error(`探索パス: ${assetsPath}`);
            throw error;
        }
    }
}

export class V1Assets {
    base: RgbaImage;
    side_mask: RgbaImage;
    mirror_mask: RgbaImage;
    center_mask: RgbaImage;
    frames: RgbaImage;

    private constructor(
        base: RgbaImage,
        side_mask: RgbaImage,
        mirror_mask: RgbaImage,
        center_mask: RgbaImage,
        frames: RgbaImage
    ) {
        this.base = base;
        this.side_mask = side_mask;
        this.mirror_mask = mirror_mask;
        this.center_mask = center_mask;
        this.frames = frames;
    }

    private static instance: V1Assets | null = null;

    static async load(basePath: string = 'assets/v1'): Promise<V1Assets> {
        if (this.instance) return this.instance;


        const rootDir = path.resolve(__dirname, '..');
        const assetsPath = path.join(rootDir, basePath);

        try {

            const baseImg = await loadImage(path.join(assetsPath, 'base.png'));
            const sideMaskImg = await loadImage(path.join(assetsPath, 'side_mask.png'));
            const mirrorMaskImg = await loadImage(path.join(assetsPath, 'mirror_mask.png'));
            const centerMaskImg = await loadImage(path.join(assetsPath, 'center_mask.png'));
            const framesImg = await loadImage(path.join(assetsPath, 'frames.png'));


            this.instance = new V1Assets(
                imageToRgba(baseImg),
                imageToRgba(sideMaskImg),
                imageToRgba(mirrorMaskImg),
                imageToRgba(centerMaskImg),
                imageToRgba(framesImg)
            );

            return this.instance;
        } catch (error) {
            console.error(`V1アセットの読み込みに失敗しました: ${error}`);
            console.error(`探索パス: ${assetsPath}`);
            throw error;
        }
    }
}


function imageToRgba(img: Image): RgbaImage {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    return {
        canvas,
        width: img.width,
        height: img.height
    };
}


export function cloneRgbaImage(image: RgbaImage): RgbaImage {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image.canvas, 0, 0);

    return {
        canvas,
        width: image.width,
        height: image.height
    };
}


export function createEmptyRgbaImage(width: number, height: number): RgbaImage {
    const canvas = createCanvas(width, height);
    return {
        canvas,
        width,
        height
    };
}