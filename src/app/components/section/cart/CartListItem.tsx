'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React from 'react';
import Accordion, {
  AccordionDetailsContainer,
  AccordionHeaderButtonsContainer,
  AccordionHeaderContainer,
  AccordionHeaderContent,
  AccordionHeaderExpandableIcon,
  AccordionHeaderIcon,
  AccordionItemContainer,
} from '@/app/components/system/Accordion';
import MaterialIcon from '@/app/components/system/MaterialIcon';

interface CartListItemProp {
  item: any;
}

const CartListItem: React.FC<CartListItemProp> = ({ item }) => {
  return (
    <Accordion key={item._id} className={style.cartItemContainer}>
      <AccordionHeaderContainer>
        <AccordionHeaderExpandableIcon>
          <MaterialIcon icon="keyboard_arrow_up" iconSize={'big'} />
        </AccordionHeaderExpandableIcon>
        <AccordionHeaderContent children={item.product.name} />
        <AccordionHeaderButtonsContainer>
          <AccordionHeaderIcon icon={'delete'} />
        </AccordionHeaderButtonsContainer>
      </AccordionHeaderContainer>
      <AccordionDetailsContainer>
        <AccordionItemContainer>
          {item.product.description}
          {item.quantity}
        </AccordionItemContainer>
      </AccordionDetailsContainer>
    </Accordion>
  );
};
export default CartListItem;
