import { createCanvas, Image, Canvas, ImageData, loadImage } from 'canvas';
import { V1Assets, V3Assets, RgbaImage, cloneRgbaImage, createEmptyRgbaImage } from './assets';
import * as fs from 'fs';


type Position = [number, number];

function morph(
    image: RgbaImage,
    target: [Position, Position, Position, Position],
    targetSize: [number, number]
): RgbaImage {

    const result = createEmptyRgbaImage(targetSize[0], targetSize[1]);
    const ctx = result.canvas.getContext('2d');


    const minX = Math.min(...target.map(p => p[0]));
    const minY = Math.min(...target.map(p => p[1]));
    const maxX = Math.max(...target.map(p => p[0]));
    const maxY = Math.max(...target.map(p => p[1]));


    const tempCanvas = createCanvas(maxX - minX, maxY - minY);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(
        image.canvas,
        0, 0, image.width, image.height,
        0, 0, maxX - minX, maxY - minY
    );


    ctx.save();
    ctx.beginPath();


    ctx.moveTo(target[0][0], target[0][1]);
    ctx.lineTo(target[1][0], target[1][1]);
    ctx.lineTo(target[3][0], target[3][1]);
    ctx.lineTo(target[2][0], target[2][1]);
    ctx.closePath();


    const sourcePoints = [
        [0, 0],
        [maxX - minX, 0],
        [0, maxY - minY],
        [maxX - minX, maxY - minY]
    ];

    const targetPoints = target.map(p => [p[0] - minX, p[1] - minY]);


    const transform = getPerspectiveTransform(sourcePoints, targetPoints);


    ctx.transform(
        transform[0], transform[3], transform[1],
        transform[4], transform[2], transform[5]
    );


    ctx.drawImage(tempCanvas, minX, minY);
    ctx.restore();

    return result;
}

function getPerspectiveTransform(
    src: number[][],
    dst: number[][]
): number[] {

    const a = src[0][0], b = src[0][1];
    const c = src[1][0], d = src[1][1];
    const e = src[2][0], f = src[2][1];

    const p = dst[0][0], q = dst[0][1];
    const r = dst[1][0], s = dst[1][1];
    const t = dst[2][0], u = dst[2][1];


    const m11 = (r - p) / (c - a);
    const m12 = (t - p) / (e - a);
    const m21 = (s - q) / (d - b);
    const m22 = (u - q) / (f - b);

    return [
        m11, m12, p - m11 * a - m12 * e,
        m21, m22, q - m21 * b - m22 * f
    ];
}

function mask(image: RgbaImage, mask: RgbaImage): RgbaImage {
    const result = cloneRgbaImage(image);
    const resultCtx = result.canvas.getContext('2d');


    resultCtx.globalCompositeOperation = 'destination-in';
    resultCtx.drawImage(mask.canvas, 0, 0);
    resultCtx.globalCompositeOperation = 'source-over';

    return result;
}

function overlay(base: RgbaImage, overlay: RgbaImage, x: number = 0, y: number = 0): void {
    const ctx = base.canvas.getContext('2d');
    ctx.drawImage(overlay.canvas, x, y);
}

export async function render_v3(target: RgbaImage): Promise<RgbaImage> {
    const v3Assets = await V3Assets.load();


    const base = cloneRgbaImage(v3Assets.base);


    const sideJackets = createEmptyRgbaImage(base.width, base.height);


    const leftNormal = morph(
        target,
        [[566, 161], [1183, 134], [633, 731], [1226, 682]],
        [base.width, base.height]
    );


    const rightNormal = morph(
        target,
        [[966, 104], [1413, 72], [954, 525], [1390, 524]],
        [base.width, base.height]
    );


    const leftMirror = morph(
        target,
        [[633, 1071], [1256, 1045], [598, 572], [1197, 569]],
        [base.width, base.height]
    );


    const rightMirror = morph(
        target,
        [[954, 1122], [1393, 1167], [942, 702], [1366, 717]],
        [base.width, base.height]
    );


    overlay(sideJackets, leftNormal);
    overlay(sideJackets, rightNormal);
    overlay(sideJackets, leftMirror);
    overlay(sideJackets, rightMirror);
    overlay(sideJackets, v3Assets.side_cover);


    const centerNormal = morph(
        target,
        [[824, 227], [1224, 227], [833, 608], [1216, 608]],
        [base.width, base.height]
    );


    const centerMirror = morph(
        target,
        [[830, 1017], [1214, 1017], [833, 676], [1216, 676]],
        [base.width, base.height]
    );


    const center = createEmptyRgbaImage(base.width, base.height);
    overlay(center, centerNormal);
    overlay(center, centerMirror);
    overlay(center, v3Assets.center_cover);


    const maskedSideJackets = mask(sideJackets, v3Assets.side_mask);
    const maskedCenter = mask(center, v3Assets.center_mask);


    overlay(base, maskedSideJackets);
    overlay(base, v3Assets.side_cover);
    overlay(base, v3Assets.windows);
    overlay(base, maskedCenter);
    overlay(base, v3Assets.bottom);

    return base;
}

export async function render_v1(target: RgbaImage): Promise<RgbaImage> {
    const v1Assets = await V1Assets.load();


    const base = cloneRgbaImage(v1Assets.base);


    const sideJackets = createEmptyRgbaImage(base.width, base.height);


    const leftNormal = morph(
        target,
        [[449, 114], [1136, 99], [465, 804], [1152, 789]],
        [base.width, base.height]
    );


    const rightNormal = morph(
        target,
        [[1018, 92], [1635, 51], [1026, 756], [1630, 740]],
        [base.width, base.height]
    );

    overlay(sideJackets, leftNormal);
    overlay(sideJackets, rightNormal);


    const centerNormal = morph(
        target,
        [[798, 193], [1252, 193], [801, 635], [1246, 635]],
        [base.width, base.height]
    );


    const centerMirror = morph(
        target,
        [[798, 1152], [1252, 1152], [795, 713], [1252, 713]],
        [base.width, base.height]
    );


    const center = createEmptyRgbaImage(base.width, base.height);


    const maskedCenterNormal = mask(centerNormal, v1Assets.center_mask);
    const maskedCenterMirror = mask(centerMirror, v1Assets.mirror_mask);

    overlay(center, maskedCenterNormal);
    overlay(center, maskedCenterMirror);

    const maskedSideJackets = mask(sideJackets, v1Assets.side_mask);


    overlay(base, maskedSideJackets);
    overlay(base, center);
    overlay(base, v1Assets.frames);

    return base;
}

export async function render(target: RgbaImage): Promise<RgbaImage> {
    return render_v3(target);
}


export const VERSION = '1.0.0'; 