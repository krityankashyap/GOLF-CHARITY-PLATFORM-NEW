import React from 'react';

const CombineContext = ({ providers, children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

export default CombineContext;
