import { j2xParser as J2xParser } from 'fast-xml-parser';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CocoFolderName, YoloFolderName, defaultSaveFolder } from '../constants';
import { pointsX } from '../components/SVGWrapper';

export const getImage = (imageUrl, fileName = 'image.jpg') =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        img.onload = function onload() {
            const { width, height } = this;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(this, 0, 0);
            canvas.toBlob(
                (blob) => {
                    resolve({
                        file: new File([blob], fileName, { type: blob.type }),
                        size: { width, height },
                    });
                },
                'image/jpeg',
                1.0,
            );
        };
        img.onerror = function onerror() {
            reject(new Error('load image error'));
        };
    });

export const getImageSize = (imageUrl) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = function onload() {
            const { width, height } = this;
            resolve({ width, height });
        };
        img.onerror = function onerror() {
            reject(new Error('load image error'));
        };
    });

export const getURLExtension = (url) => url.trim().split('.')[1];

export const coordinateFactory = ({ x, y }) => ({ x, y });

export const drawStyleFactory = (value) => ({
    shapeStyle: {
        cursor: 'pointer',
        fill: '#1890ff',
        fillOpacity: 0.2,
        stroke: '#1890ff',
        strokeWidth: Math.round(value * 0.001),
    },
    selShapeStyle: {
        cursor: 'pointer',
        fill: '#ffff00',
        fillOpacity: 0.2,
        stroke: '#ffff00',
        strokeWidth: Math.round(value * 0.001),
    },
    drawingShapePathStyle: {
        fill: '#ffff00',
        fillOpacity: 0.2,
        stroke: '#ffff00',
        strokeWidth: Math.round(value * 0.001),
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: `${Math.round(value * 0.008)}, ${Math.round(value * 0.008)}`,
    },
    drawingShapePointStyle: {
        fill: '#ffff00',
        fillOpacity: 1,
        stroke: 'transparent',
        strokeWidth: Math.round(value * 0.005),
    },
    labelStyle: {
        fill: '#000000d9',
        fontSize: Math.round(value * 0.02),
        fontWeight: 'bold',
    },
});

export const getSVGPathD = (paths, isFinish) => {
    let d = paths.reduce((accumulator, currentValue, currentIndex) => {
        if (currentIndex === 0) return `${accumulator}M${currentValue.x},${currentValue.y} `;
        return `${accumulator}L${currentValue.x},${currentValue.y} `;
    }, '');
    if (isFinish) d += 'Z';
    return d;
};

export function getShapeXYMaxMin(paths) {
    return {
        array: pointsX,
        xmin: paths.reduce((acc, cur) => (acc < cur.x ? acc : cur.x), Number.MAX_SAFE_INTEGER),
        ymin: paths.reduce((acc, cur) => (acc < cur.y ? acc : cur.y), Number.MAX_SAFE_INTEGER),
        xmax: paths.reduce((acc, cur) => (acc > cur.x ? acc : cur.x), -Number.MAX_SAFE_INTEGER),
        ymax: paths.reduce((acc, cur) => (acc > cur.y ? acc : cur.y), -Number.MAX_SAFE_INTEGER),
    };
}

export const shapeFactory = (coordinate) => {
    const paths = [coordinate];
    const d = getSVGPathD(paths, false);
    return {
        label: '',
        visible: true,
        isSelect: false,
        exactPathCount: 1,
        paths,
        d,
    };
};
export const createPathFromPoints = (points) => {
    let path = '';
    points.forEach((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        path += `${command} ${point.x} ${point.y} `;
    });
    // Đóng path
    path += 'Z';

    return path;
};
export const shapeFactoryTest = (paths) => {
    const d = getSVGPathD(paths, true);
    return {
        label: '',
        visible: true,
        isSelect: false,
        exactPathCount: 1,
        paths,
        d,
    };
};

export const imageSizeFactory = ({ width = 0, height = 0, depth = 3 }) => ({
    width,
    height,
    depth,
});

export const annotationFactory = (file) => ({
    folder: defaultSaveFolder,
    filename: file.name,
    path: `./${defaultSaveFolder}/${file.name}`,
    source: {
        database: 'Unknown',
    },
    size: {
        width: 0,
        height: 0,
        depth: 3,
    },
    segmented: 0,
    object: [],
});
export const annotationCocoTxt = (label_in, paths) => {
    const x_min = paths.reduce((acc, cur) => (acc < cur.x ? acc : cur.x), Number.MAX_SAFE_INTEGER);
    const y_min = paths.reduce((acc, cur) => (acc < cur.y ? acc : cur.y), Number.MAX_SAFE_INTEGER);
    const xmax = paths.reduce((acc, cur) => (acc > cur.x ? acc : cur.x), -Number.MAX_SAFE_INTEGER);
    const ymax = paths.reduce((acc, cur) => (acc > cur.y ? acc : cur.y), -Number.MAX_SAFE_INTEGER);
    return [
        {
            label: label_in,
            xmin: x_min,
            ymin: y_min,
            width: xmax - x_min,
            height: ymax - y_min,
        },
    ];
};
export const annotationYoloTxt = (label_in, paths, size) => {
    const x_min = paths.reduce((acc, cur) => (acc < cur.x ? acc : cur.x), Number.MAX_SAFE_INTEGER);
    const y_min = paths.reduce((acc, cur) => (acc < cur.y ? acc : cur.y), Number.MAX_SAFE_INTEGER);
    const xmax = paths.reduce((acc, cur) => (acc > cur.x ? acc : cur.x), -Number.MAX_SAFE_INTEGER);
    const ymax = paths.reduce((acc, cur) => (acc > cur.y ? acc : cur.y), -Number.MAX_SAFE_INTEGER);
    return [
        {
            label: label_in,
            x_center: (x_min + xmax) / 2 / size.width,
            y_center: (y_min + ymax) / 2 / size.height,
            width: (xmax - x_min) / size.width,
            height: (ymax - y_min) / size.height,
        },
    ];
};

export const annotationObjectFactory = (shape) => ({
    label: shape.label,
    pose: 'Unspecified',
    truncated: 0,
    difficult: 0,
    bndbox: getShapeXYMaxMin(shape.paths),
});

// convert date object to string (format: YYYYMMDDhhmmss)
export const convertDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString();
    const fMonth = month.length === 1 ? `0${month}` : month;
    const date = dateObj.getDate().toString();
    const fDate = date.length === 1 ? `0${date}` : date;
    const hour = dateObj.getHours().toString();
    const fHour = hour.length === 1 ? `0${hour}` : hour;
    const minute = dateObj.getMinutes().toString();
    const fMinute = minute.length === 1 ? `0${minute}` : minute;
    const second = dateObj.getSeconds().toString();
    const fSecond = second.length === 1 ? `0${second}` : second;
    return `${year}${fMonth}${fDate}${fHour}${fMinute}${fSecond}`;
};

// xml format
export const generateXML = (file, size, shapes) => {
    const annotation = annotationFactory(file);
    annotation.size = imageSizeFactory(size);
    annotation.object = shapes.map((shape) => annotationObjectFactory(shape, size));
    const obj = annotation;
    let xmlStr = '';
    try {
        xmlStr = new J2xParser({ format: true }).parse(obj);
    } catch (error) {
        console.error(error.message);
    }
    return xmlStr;
};

// coco RECTANGLE format
export const generateCoco = (file, size, shapes) => {
    const annotation = annotationFactory(file);
    annotation.object = shapes.map((shape) => annotationObjectFactory(shape, size));
    const text = shapes.map((shape) => annotationCocoTxt(shape.label, shape.paths));
    let arr = [];
    text.forEach((item) => {
        const { label, xmin, ymin, width, height } = item[0];
        arr.push([label, xmin, ymin, width, height]);
    });
    return JSON.stringify(arr);
};

// yolo RECTANGLE format
export const generateYolo = (file, size, shapes) => {
    const annotation = annotationFactory(file);
    annotation.size = imageSizeFactory(size);
    annotation.object = shapes.map((shape) => annotationObjectFactory(shape, size));

    const text = shapes.map((shape) => annotationYoloTxt(shape.label, shape.paths, annotation.size));
    let arr = [];
    text.forEach((item) => {
        const { label, x_center, y_center, width, height } = item[0];
        arr.push([label, x_center, y_center, width, height]);
    });
    return JSON.stringify(arr);
};

export const exportXML = (xmlStr, fileName = 'label.xml') => {
    const fileType = '.xml';
    const blob = new Blob([xmlStr], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.click();
};

// figure zip file
export const exportZip = (files, xmls, type) => {
    const zip = new JSZip();
    let folder = zip.folder(CocoFolderName);
    if (type === 'YOLO') {
        folder = zip.folder(YoloFolderName);
    }
    files.forEach((file, index) => {
        folder.file(file.name, file);
        folder.file(`${file.name.split('.')[0]}.txt`, xmls[index]);
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${convertDateToString(new Date())}.zip`);
    });
};
