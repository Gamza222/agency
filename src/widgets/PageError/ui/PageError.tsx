import { type FC } from 'react';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/shared/ui/Button';
import { TextAlign, TextSize, TextVariant } from '@/shared/ui/Text/Text.types';
import { ButtonSize, ButtonVariant } from '@/shared/ui/Button/Button.types';
import { classNames } from '@/shared/lib/utils/classNames/classNames';
import { getErrorMessage, isChunkError, isNetworkError } from '../lib/lib';
import type { PageErrorProps } from '../types/types';
import styles from './PageError.module.scss';

const PageError: FC<PageErrorProps> = (props) => {
  const { error, className } = props;

  const handleReload = () => {
    window.location.reload();
  };

  const errorMessage = getErrorMessage(error);
  const isChunk = isChunkError(error);
  const isNetwork = isNetworkError(error);

  const getTitle = (): string => {
    if (isChunk) return 'Update Available';
    if (isNetwork) return 'Connection Error';
    return 'Something went wrong';
  };

  const getDescription = (): string => {
    if (isChunk) return 'A new version is available. Please reload to get the latest updates.';
    if (isNetwork) return 'Unable to connect to the server. Please check your internet connection.';
    return errorMessage;
  };

  const getButtonText = (): string => {
    if (isChunk) return 'Reload Page';
    if (isNetwork) return 'Retry';
    return 'Try again';
  };

  return (
    <div className={classNames(styles.pageError || '', {}, [className])}>
      <div className={styles.pageError__content}>
        <Text
          as="h1"
          variant={isChunk ? TextVariant.PRIMARY : TextVariant.ERROR}
          size={TextSize.LG}
          align={TextAlign.CENTER}
        >
          {getTitle()}
        </Text>

        <Text as="p" variant={TextVariant.SECONDARY} size={TextSize.MD} align={TextAlign.CENTER}>
          {getDescription()}
        </Text>

        <div className={styles.pageError__actions}>
          <Button variant={ButtonVariant.PRIMARY} size={ButtonSize.MD} onClick={handleReload}>
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageError;
