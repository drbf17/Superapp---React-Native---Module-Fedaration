declare module 'MicroApp/SimpleComponent' {
  import React from 'react';
  
  interface SimpleComponentProps {
    title?: string;
    buttonText?: string;
    onButtonPress?: () => void;
  }
  
  const SimpleComponent: React.ComponentType<SimpleComponentProps>;
  export default SimpleComponent;
}
