import React, { useEffect, useState, useRef, RefObject } from 'react';
import styled from '@emotion/styled';

import { Artwork } from 'interfaces';
import { EditorElementStyle, EditorElementType } from './types';
import { onDraggable, getPositions, getDotStyle, onResize } from './utils';
import { Input } from '../style';

interface Prop {
    style: EditorElementStyle;
    editable?: boolean;
    type: EditorElementType;
    image?: Artwork;
    text?: string;
    align?: string;
    idx: number;
    currentElements: Array<HTMLElement | null>;
    keyToCurrentElements: (arr: Array<HTMLElement | null>) => void;
}

const EditorElement = ({
    style,
    editable = true,
    type,
    image,
    text,
    align,
    idx,
    currentElements = [],
    keyToCurrentElements,
}: Prop) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [inputValue, setInputValue] = useState('');
    const [currentStyle, setCurrentStyle] = useState(style);
    let isSelected = currentElements.some(
        (element) => element === elementRef.current,
    );
    const element = elementRef?.current;
    const [LT, LB, RT, RB] = getPositions(element);

    useEffect(() => {
        type === 'TEXT' && elementRef.current && elementRef.current.focus();
    }, []);

    const calculateStyle = () => {
        return {
            transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
            width: `${currentStyle.size.width}px`,
            height: `${currentStyle.size.height}px`,
            backgroundColor: currentStyle.backgroundColor,
            position: 'absolute' as 'absolute',
            border: isSelected ? '1px solid #3A8FD6' : '0px',
        };
    };

    const getBorderController = () => {
        return <>{getDots()}</>;
    };

    const getDots = () => {
        return (
            <>
                <div
                    style={getDotStyle('NW')}
                    onMouseDown={(e) => onResize('NW', element, e)}
                ></div>
                <div
                    style={getDotStyle('N')}
                    onMouseDown={(e) => onResize('N', element, e)}
                ></div>
                <div
                    style={getDotStyle('NE')}
                    onMouseDown={(e) => onResize('NE', element, e)}
                ></div>
                <div
                    style={getDotStyle('E')}
                    onMouseDown={(e) => onResize('E', element, e)}
                ></div>
                <div
                    style={getDotStyle('SE')}
                    onMouseDown={(e) => onResize('SE', element, e)}
                ></div>
                <div
                    style={getDotStyle('S')}
                    onMouseDown={(e) => onResize('S', element, e)}
                ></div>
                <div
                    style={getDotStyle('SW')}
                    onMouseDown={(e) => onResize('SW', element, e)}
                ></div>
                <div
                    style={getDotStyle('W')}
                    onMouseDown={(e) => onResize('W', element, e)}
                ></div>
            </>
        );
    };

    useEffect(() => {
        isSelected = currentElements.some(
            (element) => element === elementRef.current,
        );
    }, [currentElements]);

    return (
        <>
            {type === 'RECTANGULAR' ? (
                <div
                    onClick={() => keyToCurrentElements([elementRef.current])}
                    style={calculateStyle()}
                    onMouseDown={(e) => isSelected && onDraggable(e, element)}
                    ref={elementRef as RefObject<HTMLDivElement>}
                    onKeyDown={(e) => isSelected && console.log(e)}
                >
                    {isSelected && getBorderController()}
                </div>
            ) : type === 'TEXT' ? (
                <InputDiv
                    onClick={() => keyToCurrentElements([elementRef.current])}
                    style={calculateStyle()}
                    onMouseDown={(e) => isSelected && onDraggable(e, element)}
                    ref={elementRef as RefObject<HTMLDivElement>}
                    tabIndex={0}
                    onKeyDown={(e) => isSelected && { inputValue }}
                >
                    <p>{inputValue}</p>
                    {isSelected && getBorderController()}
                </InputDiv>
            ) : (
                <img
                    src={image!.originalImage}
                    onClick={() => keyToCurrentElements([elementRef.current])}
                    style={calculateStyle()}
                    onMouseDown={(e) => isSelected && onDraggable(e, element)}
                    ref={elementRef as RefObject<HTMLImageElement>}
                    draggable={false}
                />
            )}
        </>
    );
};

const InputDiv = styled.div`
    display: flex;
    justify-content: center;
    item-aligns: center;
`;

export default EditorElement;
