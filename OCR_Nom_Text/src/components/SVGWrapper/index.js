import { useEffect, useRef, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import SVGImage from './SVGImage';
import { useStoreContext } from '../../contexts/StoreContext';
import { useMouseContext } from '../../contexts/MouseContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import mouseActionTypes from '../../contexts/MouseContext/actionType';
import {
    getImageSize,
    coordinateFactory,
    getSVGPathD,
    getShapeXYMaxMin,
    drawStyleFactory,
    shapeFactory,
    imageSizeFactory,
    shapeFactoryTest,
} from '../../utils';
import { drawStatusTypes, labelStatusTypes, shapeTypes } from '../../constants';
import './SVGWrapper.scss';
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { data } from '../../pages/Import/Import';
import Loading from '../../pages/ShareComponent/Loading/Loading';

let pointsX = [];
let pointsY = [];

function SVGWrapper() {
    const svgRef = useRef(null);
    const { state, dispatch } = useStoreContext();
    const { state: mouseState, dispatch: mouseDispatch } = useMouseContext();
    const {
        imageFiles,
        selDrawImageIndex,
        imageSizes,
        currentShape,
        drawStyle,
        drawStatus,
        selShapeType,
        selShapeIndex,
        shapes,
        selLabelType,
        closePointRegion,
        dragStatus,
    } = state;
    const { shapeStyle, selShapeStyle, drawingShapePathStyle, drawingShapePointStyle, labelStyle } = drawStyle;
    const { mouseCoordinate } = mouseState;

    //dragging
    const [isDraw, setIsDraw] = useState(false);
    const [isDragging, setDragging] = useState(false);
    const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });

    //zoom images
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleZoomIn = () => {
        setScale((scale) => scale + 0.1);
    };
    const handleZoomOut = () => {
        setScale((scale) => scale - 0.1);
    };
    const [loading, setLoading] = useState(false);
    // is Insert bounding box?
    const [isInsert, setInsert] = useState(true);
    //list of object
    let listObject2 = data.data;
    //console.log(listObject2);
    // let listObject = data.objects_detection;

    // Extract coordinates from filtered objects
    // const coordinates = listObject.map((obj) => obj.coordinate);
    // const label = listObject.map((obj) => obj.name);

    useEffect(async () => {
        // listObject = data.objects_detection;
        listObject2 = data.data;

        // const dbRef = ref(imageDb);
        // const snapshot = await get(child(dbRef, 'server_url'));
        // listObject2 = await axios.post("snapshot", {
        //     link: []
        // })
        // console.log(snapshot);
    }, []);

    useEffect(async () => {
        if (selDrawImageIndex === null || imageFiles.length === 0) return;
        const objURL = window.URL.createObjectURL(imageFiles[selDrawImageIndex]);
        try {
            setLoading(true);
            const size = await getImageSize(objURL);
            const { width, height } = size;

            listObject2.filter((obj, index) => {
                if (obj.image_name.split('.')[0] === imageFiles[selDrawImageIndex].name.split('.')[0]) {
                    handleClickPath(imageFiles[selDrawImageIndex].name);
                    listObject2.splice(index);
                }
            });
            setLoading(false);

            dispatch({
                type: actionTypes.SET_IMAGE_SIZES,
                payload: {
                    imageSizes: imageSizes.map((item, index) =>
                        index === selDrawImageIndex ? imageSizeFactory({ width, height }) : item,
                    ),
                    drawStyle: drawStyleFactory(width > height ? width : height),
                },
            });
        } catch (error) {
            console.error(error);
        }
    }, [imageFiles, selDrawImageIndex]);

    const isValidCoordinate = ({ x, y }) =>
        x >= 0 && x <= imageSizes[selDrawImageIndex].width && y >= 0 && y <= imageSizes[selDrawImageIndex].height;

    useEffect(() => {
        if (imageFiles.length === 0) return;
        if (isValidCoordinate({ ...mouseCoordinate })) {
            svgRef.current.style.cursor = 'crosshair';
            if (!isDraw) svgRef.current.style.cursor = 'pointer';
            if (currentShape && currentShape.paths.length > 0) {
                // change cursor when the current point is equal to the first point
                if (
                    selShapeType === shapeTypes.POLYGON &&
                    Math.abs(currentShape.paths[0].x - mouseCoordinate.x) <= closePointRegion &&
                    Math.abs(currentShape.paths[0].y - mouseCoordinate.y) <= closePointRegion
                ) {
                    svgRef.current.style.cursor = 'pointer';
                } else {
                    svgRef.current.style.cursor = 'crosshair';
                }
            }
        } else {
            svgRef.current.style.cursor = 'not-allowed';
        }
    }, [imageFiles, currentShape, mouseCoordinate]);

    const imageProps = useMemo(() => {
        if (selDrawImageIndex === null) {
            return { href: '', width: 0, height: 0 };
        }
        return {
            href: window.URL.createObjectURL(imageFiles[selDrawImageIndex]),
            width: imageSizes[selDrawImageIndex].width,
            height: imageSizes[selDrawImageIndex].height,
        };
    }, [imageFiles, selDrawImageIndex, imageSizes]);

    const getMouseCoordinate = (event) => {
        if (!event) return coordinateFactory({ x: 0, y: 0 });

        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return coordinateFactory({ x: 0, y: 0 });
        return coordinateFactory({
            x: parseInt((event.clientX - CTM.e) / CTM.a, 10),
            y: parseInt((event.clientY - CTM.f) / CTM.d, 10),
        });
    };

    // reset draw status
    const resetDrawStatus = () => {
        dispatch({
            type: actionTypes.SET_DRAW_STATUS,
            payload: { drawStatus: drawStatusTypes.IDLE },
        });
        svgRef.current.style.cursor = 'crosshair';
    };

    const movingRectangle = (coordinate) => {
        const currentShapeCopy = cloneDeep(currentShape);
        const point1 = currentShapeCopy.paths[0];
        const point3 = coordinate;
        const point2 = { x: point1.x, y: point3.y };
        const point4 = { x: point3.x, y: point1.y };

        currentShapeCopy.paths = [point1, point2, point3, point4, point1];
        // console.log(currentShapeCopy.paths);
        // console.log(currentShapeCopy.paths);
        currentShapeCopy.exactPathCount = currentShapeCopy.paths.length - 1;
        currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);
        dispatch({
            type: actionTypes.SET_CURRENT_SHAPE,
            payload: { currentShape: currentShapeCopy },
        });
    };

    const movingPolygon = (coordinate) => {
        const currentShapeCopy = cloneDeep(currentShape);
        if (currentShapeCopy.exactPathCount === currentShapeCopy.paths.length) {
            currentShapeCopy.paths.push(coordinate);
        } else {
            currentShapeCopy.paths[currentShapeCopy.paths.length - 1] = coordinate;
        }
        currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);
        dispatch({
            type: actionTypes.SET_CURRENT_SHAPE,
            payload: { currentShape: currentShapeCopy },
        });
    };

    const drawRectanglePoint = () => {
        // finish drawing
        if (currentShape.exactPathCount === 1) return;
        dispatch({
            type: actionTypes.SET_LABELBOX_STATUS,
            payload: {
                selLabelType,
                labelBoxVisible: true,
                labelBoxStatus: labelStatusTypes.CREATE,
            },
        });
        resetDrawStatus();
    };

    const drawPolygonPoint = () => {
        if (
            currentShape.paths.length > 0 &&
            Math.abs(currentShape.paths[0].x - mouseCoordinate.x) <= closePointRegion &&
            Math.abs(currentShape.paths[0].y - mouseCoordinate.y) <= closePointRegion
        ) {
            // finish drawing
            if (currentShape.exactPathCount === 1) return;
            dispatch({
                type: actionTypes.SET_LABELBOX_STATUS,
                payload: {
                    selLabelType,
                    labelBoxVisible: true,
                    labelBoxStatus: labelStatusTypes.CREATE,
                },
            });
            resetDrawStatus();
        } else {
            // keep drawing
            pointsX = [];
            pointsY = [];
            for (var i = 0; i < currentShape.paths.length; i++) {
                pointsX.push(currentShape.paths[i].x);
                pointsY.push(currentShape.paths[i].y);
            }

            if (currentShape.exactPathCount === currentShape.paths.length) return;
            const currentShapeCopy = cloneDeep(currentShape);
            currentShapeCopy.paths[currentShapeCopy.paths.length - 1] = { ...mouseCoordinate };
            currentShapeCopy.exactPathCount += 1;
            currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);

            dispatch({
                type: actionTypes.SET_CURRENT_SHAPE,
                payload: { currentShape: currentShapeCopy },
            });
        }
    };

    const isLeftMouseClick = (event) => event.button === 0;

    const onSVGMouseDown = (event) => {
        if (dragStatus === actionTypes.DRAG_IMAGE) {
            svgRef.current.style.cursor = 'move';
            const CTM = svgRef.current.getScreenCTM();
            setPrevPosition({
                x: parseInt((event.clientX - CTM.e) / CTM.a, 10),
                y: parseInt((event.clientY - CTM.f) / CTM.d, 10),
            });
            setDragging(true);
            setIsDraw(false);
        } else if (dragStatus === actionTypes.NOT_DRAG_IMAGE) {
            svgRef.current.style.cursor = 'pointer';
            setDragging(false);
            setIsDraw(true);
        }
    };

    const onSVGMouseMove = (event) => {
        if (!isDraw && isDragging) {
            const CTM = svgRef.current.getScreenCTM();
            const deltaX = parseInt((event.clientX - CTM.e) / CTM.a, 10) - prevPosition.x;
            const deltaY = parseInt((event.clientY - CTM.f) / CTM.d, 10) - prevPosition.y;
            setPrevPosition({
                x: parseInt((event.clientX - CTM.e) / CTM.a, 10),
                y: parseInt((event.clientY - CTM.f) / CTM.d, 10),
            });
            setPosition((position) => ({
                x: position.x + deltaX,
                y: position.y + deltaY,
            }));
        }

        const coordinate = getMouseCoordinate(event);
        mouseDispatch({
            type: mouseActionTypes.SET_MOUSE_COORDINATE,
            payload: { mouseCoordinate: coordinate },
        });

        if ((drawStatus !== drawStatusTypes.DRAWING && !currentShape) || !isDraw) return;

        switch (selShapeType) {
            case shapeTypes.RECTANGLE:
                movingRectangle(coordinate);
                break;
            case shapeTypes.POLYGON:
                movingPolygon(coordinate);
                break;
            default:
        }
    };

    const onSVGMouseUp = (event) => {
        if (!isDraw) {
            setDragging(false);
        }

        if (!isLeftMouseClick(event)) return;

        if (!isValidCoordinate({ ...mouseCoordinate })) return;
        // check dragging
        if (drawStatus === drawStatusTypes.SELECT) {
            dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
            return;
        }

        if (drawStatus === drawStatusTypes.IDLE && isDraw) {
            // start drawing
            const newShape = shapeFactory(mouseCoordinate);
            dispatch({
                type: actionTypes.SET_CURRENT_SHAPE,
                payload: { currentShape: newShape },
            });
            dispatch({
                type: actionTypes.SET_DRAW_STATUS,
                payload: { drawStatus: drawStatusTypes.DRAWING },
            });
        } else if (drawStatus === drawStatusTypes.DRAWING && currentShape) {
            switch (selShapeType) {
                case shapeTypes.RECTANGLE:
                    drawRectanglePoint();
                    break;
                case shapeTypes.POLYGON:
                    drawPolygonPoint();
                    break;
                default:
            }
        }
    };

    const onShapeMouseUp = (event, index) => {
        if (!isLeftMouseClick(event)) return;
        // can not select shape when drawing
        if (drawStatus === drawStatusTypes.DRAWING) return;

        event.stopPropagation();
        dispatch({
            type: actionTypes.SET_SEL_SHAPE_INDEX,
            payload: { selShapeIndex: index === selShapeIndex ? null : index },
        });
    };

    // const createPathFromPoints = (points) => {
    //     let path = '';
    //     points.forEach((point, index) => {
    //         const command = index === 0 ? 'M' : 'L';
    //         path += `${command} ${point.x} ${point.y} `;
    //     });
    //     // Đóng path
    //     path += 'Z';

    //     return path;
    // };

    const handleClickPath = async (imageName) => {
        // danh sách tất cả các shapes đang có, phải kiểu dữ liệu mảng
        //const listShape = [shapeFactoryTest(coordinates[0]), shapeFactoryTest(coordinates[1])];
        const result = await listObject2.find((item) => {
            let imageWithoutEx = item.image_name.split('.')[0];
            // console.log(imageWithoutEx);
            let imageNameNew = imageName.split('.')[0];
            return imageWithoutEx === imageNameNew;
        });
        let list = [];
        if (result) {
            list = result.objects_detection
                .filter((obj) => obj.confidence > 0.3)
                .map((obj) => ({
                    coordinate: obj.coordinate,
                    name: obj.class,
                }));
        }
        //console.log(list[0].coordinate);
        // let listShape = listObject
        //     .filter((obj) => obj.image_name === imageName)
        //     .map((obj) => shapeFactoryTest(obj.coordinate));
        // let listLabel = listObject.filter((obj) => obj.imageName === imageName);
        // for (var i = 0; i < listShape.length; i++) {
        //     const newShape = listShape[i];
        //     dispatch({
        //         type: actionTypes.SET_CURRENT_SHAPE,
        //         payload: { currentShape: newShape },
        //     });
        // }
        for (var i = 0; i < list.length; i++) {
            const newShape = shapeFactoryTest(list[i].coordinate);
            dispatch({
                type: actionTypes.SET_CURRENT_SHAPE,
                payload: { currentShape: newShape },
            });
        }

        const shapesCopy = cloneDeep(shapes);

        // for (var i = 0; i < listShape.length; i++) {
        //     let currentShapeCopy = cloneDeep(listShape[i]);
        //     currentShapeCopy.paths.pop();
        //     currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, true);
        //     currentShapeCopy.label = listLabel[i].name;
        //     shapesCopy[selDrawImageIndex] = [...shapesCopy[selDrawImageIndex], currentShapeCopy];
        // }
        for (var i = 0; i < list.length; i++) {
            let currentShapeCopy = cloneDeep(shapeFactoryTest(list[i].coordinate));
            currentShapeCopy.paths.pop();
            currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, true);
            currentShapeCopy.label = list[i].name;
            shapesCopy[selDrawImageIndex] = [...shapesCopy[selDrawImageIndex], currentShapeCopy];
        }

        dispatch({ type: actionTypes.SET_SHAPES, payload: { shapes: shapesCopy } });
    };

    return (
        <div className="svg-wrapper" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {loading && (
                <div className="loading-animation">
                    <Loading />
                </div>
            )}
            {imageFiles[selDrawImageIndex] && (
                <svg
                    className="svg-container"
                    ref={svgRef}
                    viewBox={`0 0 ${imageSizes[selDrawImageIndex].width} ${imageSizes[selDrawImageIndex].height}`}
                    onMouseMove={onSVGMouseMove}
                    onMouseUp={onSVGMouseUp}
                    onMouseDown={onSVGMouseDown}
                    style={{ cursor: 'move' }}
                    transform={`scale(${scale}) translate(${position.x} ${position.y})`}
                >
                    <SVGImage {...imageProps} />

                    {currentShape && (
                        <g>
                            <path d={currentShape.d} style={{ ...drawingShapePathStyle }} />
                            {currentShape.paths.map((point) => (
                                <circle
                                    key={uuidv4()}
                                    cx={point.x}
                                    cy={point.y}
                                    style={{ ...drawingShapePointStyle }}
                                    r={drawingShapePointStyle.strokeWidth}
                                />
                            ))}
                        </g>
                    )}

                    {shapes[selDrawImageIndex] &&
                        Array.isArray(shapes[selDrawImageIndex]) &&
                        shapes[selDrawImageIndex].map((shape, index) =>
                            !shape.visible ? null : (
                                <g key={shape.d}>
                                    <path
                                        d={shape.d}
                                        style={shape.isSelect ? { ...selShapeStyle } : { ...shapeStyle }}
                                        onMouseUp={(event) => onShapeMouseUp(event, index)}
                                    />
                                    {shape.label && (
                                        <text
                                            x={getShapeXYMaxMin(shape.paths).xmin}
                                            y={getShapeXYMaxMin(shape.paths).ymin}
                                            style={{ ...labelStyle }}
                                        >
                                            {shape.label}
                                        </text>
                                    )}
                                </g>
                            ),
                        )}
                </svg>
            )}
            <div
                style={{
                    display: 'flex',
                    right: '0',
                    flexDirection: 'column',
                    width: '40px',
                    marginRight: '3px',
                }}
            >
                <button
                    onClick={handleZoomIn}
                    style={{
                        position: 'relative',
                        zIndex: '100',
                        fontSize: '20px',
                        border: ' 1px solid grey',
                        marginBottom: '5px',
                        borderRadius: '20%',
                    }}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
                </button>
                <button
                    onClick={handleZoomOut}
                    style={{
                        position: 'relative',
                        zIndex: '100',
                        fontSize: '20px',
                        border: ' 1px solid grey',
                        borderRadius: '20%',
                    }}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                </button>
            </div>
        </div>
    );
}

export default SVGWrapper;
export { pointsX, pointsY };
