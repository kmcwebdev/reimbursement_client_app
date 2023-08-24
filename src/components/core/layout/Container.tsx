import React, { type PropsWithChildren } from 'react';
import PageAnimation from '~/components/animation/PageAnimation';



const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <PageAnimation >
      <div>
        {children}
      </div>
    </PageAnimation>);
}

export default Container;