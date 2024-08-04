FROM public.ecr.aws/lambda/python:3.11

COPY requirements.txt ${LAMBDA_TASK_ROOT}

# パッケージのインストール
RUN pip install -r requirements.txt

# ファイルのコピー
COPY src/* ${LAMBDA_TASK_ROOT}

# mainのハンドラー関数を実行
CMD [ "main.handler" ]