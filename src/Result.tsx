import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  const [model, setModel] = useState<Model>({
    paramValues: [
      { paramId: 1, value: 'Значение по умолчанию' },
      { paramId: 2, value: 'Значение по умолчанию-2' },
    ],
  });

  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const paramEditorRef = useRef<ParamEditorHandle>(null);

  const handleGetModel = () => {
    console.log(paramEditorRef.current);
    if (paramEditorRef.current) {
      const updatedModel = paramEditorRef.current.getModel();
      console.log('Обновленная модель:', updatedModel);
      setModel(updatedModel);
    }
  };

  return (
    <div>
      <h1>Редактор параметров товара</h1>
      <ParamEditor params={params} model={model} ref={paramEditorRef} />
      <button onClick={handleGetModel}>Получить модель</button>
      <pre>
        params:
        <br />
        {JSON.stringify(params, null, 2)}
      </pre>
      <pre>
        model:
        <br />
        {JSON.stringify(model, null, 2)}
      </pre>
    </div>
  );
};

export default App;

export interface Param {
  id: number;
  name: string;
  type: 'string';
}

export interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface Model {
  paramValues: ParamValue[];
}

export interface Props {
  params: Param[];
  model: Model;
}

export interface ParamEditorHandle {
  getModel: () => Model;
}

const fieldStyles = {
  width: '300px',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const ParamEditor = React.forwardRef<ParamEditorHandle, Props>(
  ({ params, model }, ref) => {
    const [paramValues, setParamValues] = useState<Record<number, string>>({});

    useEffect(() => {
      const initialValues: Record<number, string> = {};
      model.paramValues.forEach((pv) => {
        initialValues[pv.paramId] = pv.value;
      });
      setParamValues(initialValues);
    }, [model.paramValues]);

    const getModel = useCallback((): Model => {
      const updatedParamValues: ParamValue[] = Object.entries(paramValues).map(
        ([paramId, value]) => ({
          paramId: parseInt(paramId, 10),
          value,
        })
      );
      return {
        ...model,
        paramValues: updatedParamValues,
      };
    }, [model, paramValues]);

    useImperativeHandle(ref, () => ({
      getModel: getModel,
    }));

    const handleInputChange = useCallback(
      (paramId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setParamValues((prevValues) => ({
          ...prevValues,
          [paramId]: event.target.value,
        }));
      },
      []
    );

    return (
      <div>
        {params.map((param) => (
          <div key={param.id} style={{ ...fieldStyles }}>
            <label htmlFor={`param-${param.id}`}>{param.name}:</label>
            <input
              type='text'
              id={`param-${param.id}`}
              value={paramValues[param.id] || ''}
              onChange={(event) => handleInputChange(param.id, event)}
            />
          </div>
        ))}
      </div>
    );
  }
);
