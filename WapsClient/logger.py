
import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger('FollowSwaps')
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
fh = RotatingFileHandler('log', mode='a', encoding='utf-8', maxBytes=1024*1024* 50, backupCount=5)
fh.setLevel(logging.DEBUG)
fh.setFormatter(formatter)
logger.addHandler(ch)
logger.addHandler(fh)