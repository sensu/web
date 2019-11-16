import gql from "/vendor/graphql-tag";
import { usePublishCheckStatusToast } from "/lib/component/toast";

interface Props {
  children: (_: any) => JSX.Element;
  check: {
    id?: string;
    name?: string;
  };
  onChange: (_: any) => Promise<any>;
  publish: boolean;
}

const CheckDetailChangePublishStateAction = ({
  children,
  check = {},
  publish,
  onChange,
}: Props) => {
  const { id, name } = check;
  const createPublishCheckStatusToast = usePublishCheckStatusToast();

  return children(() => {
    const promise = onChange({
      id,
      publish,
    });

    createPublishCheckStatusToast(promise, {
      checkName: name,
      publish,
    });
  });
};

CheckDetailChangePublishStateAction.fragments = {
  check: gql`
    fragment CheckDetailsPublishAction_check on CheckConfig {
      id
      name
    }
  `,
};

export default CheckDetailChangePublishStateAction;
