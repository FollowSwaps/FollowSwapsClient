
class FollowSwapsErr(Exception):
    pass



class FeatureNotReady(FollowSwapsErr):
    pass

class TooHighGas(FollowSwapsErr):
    pass

class LowBalance(FollowSwapsErr):
    pass