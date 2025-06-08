import React, {
  Context,
  createContext,
  PropsWithChildren,
  useEffect,
} from 'react';
import style from '@/styles/system/Accordion.module.scss';
import AssetIcon, {
  ComponentSize,
  IconType,
} from '@/app/components/system/AssetIcon';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import { motion, Variants } from 'framer-motion';
import { Tooltip } from '@mui/material';

interface AccordionContextType {
  expanded: boolean;
  toggle: () => void;
  disabled: boolean;
}

const AccordionContext: Context<AccordionContextType> =
  createContext<AccordionContextType>({
    expanded: false,
    toggle: () => {},
    disabled: false,
  });

const useAccordion = (): AccordionContextType => {
  return React.useContext(AccordionContext);
};

export interface AccordionProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  disabled?: boolean;
  expanded?: boolean;
  onAccordionChange?: (expanded: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  disabled = false,
  expanded: propExpanded = false,
  onAccordionChange,
  children,
  className,
  ...restProps
}): React.ReactElement => {
  const [expanded, setExpanded] = React.useState<boolean>(propExpanded);

  useEffect(() => {
    setExpanded(propExpanded);
  }, [propExpanded]);

  const handleToggle = (): void => {
    setExpanded(!expanded);
    onAccordionChange?.(!expanded);
  };

  const contextValue: AccordionContextType = {
    expanded,
    toggle: handleToggle,
    disabled,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <motion.div
        animate={expanded ? 'open' : 'closed'}
        initial={false}
        className={className}
      >
        <div {...restProps} children={children} />
      </motion.div>
    </AccordionContext.Provider>
  );
};

export const AccordionHeaderContainer: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  const { disabled, toggle, expanded } = useAccordion();
  return (
    <motion.section
      whileTap={{ scale: 0.97 }}
      data-disabled={disabled}
      data-expanded={expanded}
      onClick={!disabled ? toggle : undefined}
      className={style['list-container-item']}
      children={children}
    />
  );
};

interface AccordionHeaderIconProps {
  icon?: string;
  asset?: IconType;
  iconSize?: ComponentSize;
}

export const AccordionHeaderIcon: React.FC<AccordionHeaderIconProps> = ({
  iconSize,
  icon,
  asset,
}): React.ReactElement => {
  return (
    <span data-cy={'list-container-item-icon'} className={style['item-icon']}>
      {asset && <AssetIcon size={iconSize} icon={asset} />}
      {icon && <MaterialIcon outlined icon={icon} iconSize={iconSize} />}
    </span>
  );
};

export const AccordionHeaderContent: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  return (
    <section
      data-cy={'list-container-item-content'}
      className={style['item-content-container']}
    >
      <section className={style['item-content']} children={children} />
    </section>
  );
};

export const AccordionHeaderExpandableIcon: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  return (
    <motion.span
      variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
      transition={{ duration: 0.2 }}
      className={style['accordion-header-expandable-icon']}
      children={children}
    />
  );
};

interface AccordionHeaderButtonsContainerProps extends PropsWithChildren {
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  flexDirection?: 'row' | 'column';
}

export const AccordionHeaderButtonsContainer: React.FC<
  AccordionHeaderButtonsContainerProps
> = ({
  children,
  tooltip,
  tooltipPlacement = 'left',
  flexDirection = 'column',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation(); // Prevent the click from bubbling up to the header
  };

  return (
    <Tooltip
      title={tooltip}
      placement={tooltipPlacement}
      arrow
      leaveDelay={200}
    >
      <span
        // style={{ display: 'flex', flexDirection: flexDirection }}
        onClick={handleClick}
      >
        {children}
      </span>
    </Tooltip>
  );
};

interface AccordionDetailsProps extends PropsWithChildren {
  overflow?: boolean;
  maxHeight?: string;
}

export const AccordionDetailsContainer: React.FC<AccordionDetailsProps> = ({
  overflow = true,
  maxHeight,
  children,
}): React.ReactElement => {
  const containerRef: React.RefObject<HTMLDivElement | null> =
    React.useRef<HTMLDivElement>(null);

  const variants: Variants = {
    open: {
      height: '100%',
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.05,
      },
      maxHeight: maxHeight ? maxHeight : 'auto',
      overflowY: maxHeight ? 'auto' : 'hidden',
      marginBottom: '0.25rem',
    },
    closed: {
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      },
      height: '1px',
      overflow: overflow ? 'auto' : 'hidden',
    },
  };

  return (
    <motion.div
      layoutScroll
      variants={variants}
      ref={containerRef}
      className={style['accordion-details-container']}
    >
      {children}
    </motion.div>
  );
};

export const AccordionItemContainer: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  const variants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={variants}
      style={{ marginBottom: '1px' }}
      children={children}
    ></motion.div>
  );
};

export const AccordionNoItemsContainer: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  return (
    <div
      className={style['accordion-no-items-container']}
      children={children}
    ></div>
  );
};

export default Accordion;
