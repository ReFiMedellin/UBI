import { Button as _Button, ButtonProps } from './_button';
import { Loader2 } from 'lucide-react';

function Button({
  loading,
  children,
  ...props
}: { loading?: boolean } & ButtonProps) {
  return (
    <_Button {...props} disabled={loading ? true : props.disabled}>
      <>
      {loading && <Loader2 className='animate-spin' />}
      {children}
      </>
    </_Button>
  );
}

export { Button };
