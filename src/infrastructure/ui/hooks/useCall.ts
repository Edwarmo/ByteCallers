import { useState, useEffect } from 'react';
import { Call } from '../../../core/domain/entities/Call';
import { services } from '../../ServiceContainer';

export const useCall = () => {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  const controls = services.calls.controls();

  const receiveCall = async (phoneNumber: string, audioStreamUrl?: string) => {
    const call = await services.calls.receive({
      id: Date.now().toString(),
      phoneNumber,
      audioStreamUrl,
    });
    setActiveCall(call);
    return call;
  };

  const mute = async () => {
    await controls.mute();
    setIsMuted(true);
  };

  const unmute = async () => {
    await controls.unmute();
    setIsMuted(false);
  };

  const hold = async () => {
    await controls.hold();
    setIsOnHold(true);
  };

  const resume = async () => {
    await controls.resume();
    setIsOnHold(false);
  };

  const hangup = async () => {
    await controls.hangup();
    setActiveCall(null);
    setIsMuted(false);
    setIsOnHold(false);
  };

  const transfer = async (targetNumber: string) => {
    await controls.transfer(targetNumber);
  };

  useEffect(() => {
    const current = services.calls.getActive();
    setActiveCall(current);
  }, []);

  return {
    activeCall,
    isMuted,
    isOnHold,
    receiveCall,
    mute,
    unmute,
    hold,
    resume,
    hangup,
    transfer,
  };
};
