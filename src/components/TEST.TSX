import { FC } from "react";
interface CoinIconProps {
    cryptocurrency: {
        symbol?: string;
        icon?: string;
        color?: string;
        isFont?: boolean;
        name?: string;
    };
    size?: number | string;
}

export const CoinIcon: FC<CoinIconProps> = ({ cryptocurrency, size = 40 }) => {
    const { symbol, icon, isFont, color, name } = cryptocurrency;

    const sizeStyle = typeof size === "number" ?
${size}px
: size; // number یا string

    if (symbol === "toman" || name?.toLowerCase() === "toman") {
        return (
            <img
                src="/assets/images/im_persian.png"
                style={{ width: sizeStyle, height: sizeStyle }}
                alt="toman"
            />
        );
    }
