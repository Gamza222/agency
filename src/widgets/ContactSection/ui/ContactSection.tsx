import { classNames } from "@/shared/lib/utils/classNames/classNames";
import styles from "./ContactSection.module.scss";
import { Contact } from "./Contact/Contact";

export const ContactSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={classNames(styles.contactSection, {}, [className])}
      id="contact"
    >
      <Contact />
      {/* <div className={styles.spacer} /> */}
      {/* <Footer /> */}
    </section>
  );
};
