/* eslint-disable react/no-danger */
import React, { FC, ReactNode } from 'react';

import cn from 'classnames';

import styles from './Text.module.scss';

export type TextTags = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'p2';

export interface ITextProps {
    tagStyle: TextTags;
    tag?: TextTags;
    color?: 'white' | 'grey';
    fontWeight?: 700 | 600 | 500 | 400;
    className?: string;
    dangerouslySetInnerHTML?: string;
    children?: ReactNode;
}

export const Text: FC<ITextProps> = ({
    tagStyle,
    tag,
    color = 'white',
    fontWeight = 400,
    className,
    dangerouslySetInnerHTML,
    children,
}) => {
    let Tag = 'span';

    if (['p', 'p2'].includes(tagStyle)) {
        Tag = 'p';
    }
    if (tagStyle.includes('h')) {
        Tag = tagStyle;
    }

    if (tag) {
        Tag = tag;
    }

    const combinedClassName = cn(
        styles['text'],
        styles[`text-${tagStyle}`],
        styles[`text-color-${color}`],
        styles[`text-font-weight-${fontWeight}`],
        className,
    );

    return (
        <>
            {dangerouslySetInnerHTML ? (
                <Tag
                    // @ts-ignore
                    className={combinedClassName}
                    dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTML }}
                />
            ) : (
                // @ts-ignore
                <Tag className={combinedClassName}>{children}</Tag>
            )}
        </>
    );
};
