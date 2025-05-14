import React, { useCallback, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ParamEditor, { Model, Param, ParamEditorHandle } from './ParamEditor';

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
