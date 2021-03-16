// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Junkeng {

    struct ParticipantContext {
        uint index;
        uint8 status;  // 0 未参加、1 参加した、2 じゃんけん出した
    }

    struct Queue {
        address addr;
        uint8 handShape;  // 0 未確定、1 グー、2 チョキ、3 パー
        int8 result;  // 0: あいこ、1: 勝ち、-1: 負け
        uint timestamp;
    }

    address private admin;
    address private coin;
    Queue[] private queue;
    mapping (address => ParticipantContext) private participants;

    /**
     * マッチ確定イベント
     */
    event Established(uint a_index, uint b_index);

    /**
     * じゃんけん確定イベント
     */
    event Disclosed(uint a_index, uint8 a_handShape, uint b_index, uint8 b_handShape);

    /**
     * 結果通知イベント
     */
    event Settled(uint index, uint8 handShape, int8 result);

    /**
     * 参加者である事
     */
    modifier participating() {
        require(participants[msg.sender].status > 0, "Not participants");
        _;
    }

    /**
     * 未だ参加していない事
     */
    modifier notParticipating() {
        require(participants[msg.sender].status == 0, "Already participated");
        _;
    }

    /**
     * 対戦相手を取得
     */
    function getOpponent(uint index) view private returns (uint) {
        // キュー内の隣り合った奇数と偶数で対戦
        uint opponent = index / 2 * 2 + (index + 1) % 2;
        require(opponent < queue.length, "Opponent not ready");

        return opponent;
    }

    /**
     * じゃんけん実行済み
     * マッチ成立から15分で時間切れになります
     */
    modifier disclosed() {
        require(participants[msg.sender].status == 2, "Not disclosed yet");

        uint index = participants[msg.sender].index;
        uint opponent = getOpponent(index);

        uint duration = block.timestamp - ((queue[index].timestamp > queue[opponent].timestamp)
            ? queue[index].timestamp : queue[opponent].timestamp);

        if (queue[opponent].handShape == 0 && duration > 15 minutes) {
            // 時間切れ→相手を必ず負けにする
            uint8[4] memory lookupTable = [0, 2, 3, 1];
            queue[opponent].handShape = lookupTable[queue[index].handShape];
        } else {
            require(queue[opponent].handShape > 0, "Opponent hasn't disclosed hand shape");
        }
        _;
    }

    /**
     * コンストラクタ
     * 引数に勝利コインのコントラクトアドレスを指定する
     */
    constructor(address _coin) {
        coin = _coin;
        admin = msg.sender;
    }

    /**
     * 参加キューに並ぶ
     */
    function join() public notParticipating returns (uint index) {
        uint  height = queue.length;

        queue.push(Queue({
            addr: msg.sender,
            handShape: 0,
            result: 0,
            timestamp: block.timestamp
        }));
        participants[msg.sender] = ParticipantContext({
            index: height,
            status: 1
        });

        if (height % 2 == 1) {
            // 奇数ならマッチ成立
            emit Established(height - 1, height);
        }

        return height;
    }

    /**
     * じゃんけん実行
     * _handShape: 0 グー、1 パー、2 チョキ
     */
    function disclose(uint8 _handShape) public participating {
        require(participants[msg.sender].status == 1, "Already disclosed" );
        require(_handShape >= 1 && _handShape <= 3, "Invalid hand shape");

        uint index = participants[msg.sender].index;
        uint opponent = getOpponent(index);

        queue[index].handShape = _handShape;
        queue[index].timestamp = block.timestamp;
        participants[msg.sender].status = 2;

        if (queue[opponent].handShape > 0) {
            // イベント発生
            emit Disclosed(
                index,
                queue[index].handShape,
                opponent,
                queue[opponent].handShape
            );
        }
    }

    /**
     * 結果を取得
     * result: 0 であいこ、1 で勝利、-1 で敗北
     */
    function settle() public participating disclosed returns (int8 result) {
        uint index = participants[msg.sender].index;
        uint opponent = getOpponent(index);

        int8[4][4] memory lookupTable = [
            [int8(0), int8(0), int8(0), int8(0)],
            [int8(0), int8(0), int8(1), int8(-1)],
            [int8(0), int8(-1), int8(0), int8(1)],
            [int8(0), int8(1), int8(-1), int8(0)]
        ];
        result = lookupTable[queue[index].handShape][queue[opponent].handShape];

        // 状態リセットて次回参加可能にする
        participants[msg.sender].status = 0;
        queue[index].timestamp = block.timestamp;

        if (result == 1) {
            // JKC 1 個授与
            IERC20(coin).transferFrom(admin, msg.sender, 1);
        }

        // イベント発生
        emit Settled(index, queue[index].handShape, result);
    }
}
