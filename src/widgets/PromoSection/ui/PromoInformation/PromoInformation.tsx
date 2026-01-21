import { classNames } from "@/shared/lib/utils/classNames/classNames";
import styles from "./PromoInformation.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";

export const PromoInformation = ({ className }: { className?: string }) => {
  return (
    <section className={classNames(styles.PromoInformation, {}, [className])}>
      <div className={styles.PromoInformationContent}>
        <Text
          size={TextSize.XL2}
          fontWeight={TextFontWeight.XL}
          variant={TextVariant.PRIMARY}
          className={styles.PromoInformationContent__text}
        >
          / We offer a one-time <span>Free Video Edit up to 45 Seconds</span>{" "}
          for anyone considering working with us.
        </Text>
        <Text
          size={TextSize.XL2}
          fontWeight={TextFontWeight.XL}
          variant={TextVariant.PRIMARY}
          className={styles.PromoInformationContent__text}
        >
          / You can use it for a Promotion, Advertisement, Social Media Post, or
          Any Short-form Content you need.
        </Text>
        <Text
          size={TextSize.XL2}
          variant={TextVariant.PRIMARY}
          fontWeight={TextFontWeight.XL}
          className={styles.PromoInformationContent__text}
        >
          / If you like the result, we may continue with a paid collaboration.
          If not, there’s No Obligation.
        </Text>
      </div>
    </section>
  );
};
