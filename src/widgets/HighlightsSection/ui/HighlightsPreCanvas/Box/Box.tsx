import React, { memo } from "react";
import styles from "./Box.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";
import { classNames } from "@/shared/lib/utils/classNames";
import ExpandArrow from "@/shared/assets/icons/expand-arrow.svg?react";

interface BoxProps {
  className?: string;
}

export const Box = memo((props: BoxProps) => {
  const { className } = props;

  return (
    <div
      className={classNames(styles.highlightsPreCanvas__mainBox, {}, [
        className,
      ])}
    >
      <div className={styles.labelRow}>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.MD}
          fontWeight={TextFontWeight.XL2}
          className={styles.labelText}
          as="span"
        >
          Overscan
        </Text>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.MD}
          fontWeight={TextFontWeight.XL2}
          className={styles.labelText}
          as="span"
        >
          1920 x 1080
        </Text>
      </div>

      {/* Middle box (Crop) */}
      <div className={styles.highlightsPreCanvas__middleBox}>
        <div className={styles.labelRow}>
          <Text
            variant={TextVariant.SECONDARY}
            size={TextSize.MD}
            fontWeight={TextFontWeight.XL2}
            className={styles.labelText}
            as="span"
          >
            Crop
          </Text>
          <Text
            variant={TextVariant.SECONDARY}
            size={TextSize.MD}
            fontWeight={TextFontWeight.XL2}
            className={styles.labelText}
            as="span"
          >
            1280 x 720
          </Text>
        </div>

        {/* Expand arrow */}
        <div className={styles.expandArrow}>
          <ExpandArrow />
          <Text
            variant={TextVariant.SECONDARY}
            size={TextSize.MD}
            fontWeight={TextFontWeight.XL2}
            className={styles.labelText}
            as="span"
          >
            [ 16:9 ]
          </Text>
        </div>

        {/* Inner box (Action safe) */}
        <div className={styles.highlightsPreCanvas__innerBox}>
          <div className={styles.labelRow}>
            <Text
              variant={TextVariant.SECONDARY}
              size={TextSize.MD}
              fontWeight={TextFontWeight.XL2}
              className={styles.labelText}
              as="span"
            >
              Action safe
            </Text>
            <Text
              variant={TextVariant.SECONDARY}
              size={TextSize.MD}
              fontWeight={TextFontWeight.XL2}
              className={styles.labelText}
              as="span"
            >
              1280 x 720
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Box;
